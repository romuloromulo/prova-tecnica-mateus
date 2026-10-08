package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.CreateOrderRequest;
import com.grupomateus.supermarket.dto.OrderResponseDto;
import com.grupomateus.supermarket.dto.PaymentSimulationRequest;
import com.grupomateus.supermarket.exception.BusinessRuleException;
import com.grupomateus.supermarket.exception.CaderninhoLimitExceededException;
import com.grupomateus.supermarket.exception.InsufficientStockException;
import com.grupomateus.supermarket.exception.ResourceNotFoundException;
import com.grupomateus.supermarket.model.*;
import com.grupomateus.supermarket.repository.CartItemRepository;
import com.grupomateus.supermarket.repository.OrderRepository;
import com.grupomateus.supermarket.repository.ProductRepository;
import com.grupomateus.supermarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("150.00");
    private static final BigDecimal STANDARD_DELIVERY_FEE = new BigDecimal("15.00");

    @Transactional(rollbackFor = Exception.class)
    public OrderResponseDto checkout(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + userId));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BusinessRuleException("O carrinho está vazio. Adicione itens antes de finalizar a compra.");
        }

        
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new InsufficientStockException(product.getName(), item.getQuantity(), product.getStockQuantity());
            }
        }

      
        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : STANDARD_DELIVERY_FEE;
        BigDecimal totalAmount = subtotal.add(deliveryFee);

        
        OrderStatus initialStatus = OrderStatus.APPROVED;
        String failureReason = null;

        if (request.paymentMethod() == PaymentMethod.CADERNINHO) {
            if (user.getCaderninhoLimit().compareTo(totalAmount) < 0) {
                throw new CaderninhoLimitExceededException(user.getCaderninhoLimit(), totalAmount);
            }
            
            user.setCaderninhoLimit(user.getCaderninhoLimit().subtract(totalAmount));
            userRepository.save(user);
            log.info("Pedido pago via Caderninho para usuário {}. Novo saldo: R$ {}", user.getEmail(), user.getCaderninhoLimit());
        } else if (request.paymentMethod() == PaymentMethod.CARTAO_CREDITO) {
            String cardNumber = request.getEffectiveCardNumber();
            if (cardNumber != null && cardNumber.replace(" ", "").endsWith("0000")) {
                initialStatus = OrderStatus.REJECTED;
                failureReason = "Transação não autorizada pela operadora do cartão.";
            }
        }

        
        if (initialStatus == OrderStatus.REJECTED) {
            Order rejectedOrder = buildOrder(user, request, subtotal, deliveryFee, totalAmount, initialStatus, failureReason);
            for (CartItem item : cartItems) {
                OrderItem orderItem = OrderItem.builder()
                        .product(item.getProduct())
                        .productName(item.getProduct().getName())
                        .unitPrice(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build();
                rejectedOrder.addItem(orderItem);
            }
            return OrderResponseDto.fromEntity(orderRepository.save(rejectedOrder));
        }

        
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        
        Order order = buildOrder(user, request, subtotal, deliveryFee, totalAmount, initialStatus, failureReason);
        for (CartItem item : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .product(item.getProduct())
                    .productName(item.getProduct().getName())
                    .unitPrice(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .totalPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

       
        cartItemRepository.deleteByUserId(userId);

        log.info("Pedido {} finalizado com sucesso com valor total de R$ {}", savedOrder.getOrderNumber(), totalAmount);
        return OrderResponseDto.fromEntity(savedOrder);
    }

    @Transactional
    public OrderResponseDto simulatePayment(PaymentSimulationRequest simRequest) {
        Order order = orderRepository.findByOrderNumber(simRequest.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + simRequest.orderId()));

        order.setStatus(simRequest.simulateStatus());
        if (simRequest.simulateStatus() == OrderStatus.REJECTED) {
            order.setFailureReason(simRequest.rejectionReason() != null ? simRequest.rejectionReason() : "Pagamento recusado na simulação.");
        }
        Order updated = orderRepository.save(order);
        return OrderResponseDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> listOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponseDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByNumber(Long userId, String orderNumber) {
        Order order = orderRepository.findByOrderNumberAndUserId(orderNumber, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + orderNumber));
        return OrderResponseDto.fromEntity(order);
    }

    private Order buildOrder(
            User user,
            CreateOrderRequest req,
            BigDecimal subtotal,
            BigDecimal deliveryFee,
            BigDecimal totalAmount,
            OrderStatus status,
            String failureReason
    ) {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String randomSuffix = String.format("%04d", RANDOM.nextInt(10000));
        String orderNumber = "PED-" + datePart + "-" + randomSuffix;

        return Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .totalAmount(totalAmount)
                .paymentMethod(req.paymentMethod())
                .status(status)
                .failureReason(failureReason)
                .recipientName(req.getEffectiveRecipientName())
                .street(req.getEffectiveStreet())
                .number(req.getEffectiveNumber())
                .neighborhood(req.getEffectiveNeighborhood())
                .city(req.getEffectiveCity())
                .state(req.getEffectiveState())
                .cep(req.getEffectiveCep())
                .build();
    }
}
