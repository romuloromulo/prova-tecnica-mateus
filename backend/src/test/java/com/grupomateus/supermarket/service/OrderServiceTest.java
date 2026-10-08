package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.CreateOrderRequest;
import com.grupomateus.supermarket.dto.OrderResponseDto;
import com.grupomateus.supermarket.exception.BusinessRuleException;
import com.grupomateus.supermarket.exception.CaderninhoLimitExceededException;
import com.grupomateus.supermarket.exception.InsufficientStockException;
import com.grupomateus.supermarket.model.*;
import com.grupomateus.supermarket.repository.CartItemRepository;
import com.grupomateus.supermarket.repository.OrderRepository;
import com.grupomateus.supermarket.repository.ProductRepository;
import com.grupomateus.supermarket.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Product product;
    private CartItem cartItem;
    private CreateOrderRequest validOrderRequest;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Dona Marta")
                .email("marta@mateus.com")
                .caderninhoLimit(new BigDecimal("800.00"))
                .build();

        product = Product.builder()
                .id(10L)
                .name("Arroz Branco Tipo 1 5kg")
                .category("MERCEARIA")
                .price(new BigDecimal("28.90"))
                .stockQuantity(15)
                .build();

        cartItem = CartItem.builder()
                .id(100L)
                .user(user)
                .product(product)
                .quantity(2)
                .build();

        validOrderRequest = new CreateOrderRequest(
                "Dona Marta",
                "Rua do Sol",
                "123",
                "Centro",
                "São Luís",
                "MA",
                "65000-000",
                PaymentMethod.CADERNINHO,
                null, null, null, null, null
        );
    }

    @Test
    @DisplayName("Deve finalizar compra via Caderninho com sucesso, deduzindo limite e estoque")
    void testCheckoutWithCaderninhoSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponseDto response = orderService.checkout(1L, validOrderRequest);

        assertNotNull(response);
        assertEquals(OrderStatus.APPROVED, response.status());
        assertEquals(PaymentMethod.CADERNINHO, response.paymentMethod());

        BigDecimal expectedTotal = new BigDecimal("72.80");
        assertEquals(expectedTotal, response.totalAmount());

        assertEquals(13, product.getStockQuantity());
        verify(productRepository, times(1)).save(product);

        assertEquals(new BigDecimal("727.20"), user.getCaderninhoLimit());
        verify(userRepository, times(1)).save(user);

        verify(cartItemRepository, times(1)).deleteByUserId(1L);
    }

    @Test
    @DisplayName("Deve lançar CaderninhoLimitExceededException quando o limite for menor que o total")
    void testCheckoutWithCaderninhoExceededLimit() {
        user.setCaderninhoLimit(new BigDecimal("50.00"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));

        assertThrows(CaderninhoLimitExceededException.class, () -> {
            orderService.checkout(1L, validOrderRequest);
        });

        assertEquals(15, product.getStockQuantity());
        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar InsufficientStockException quando o estoque for insuficiente")
    void testCheckoutWithInsufficientStock() {
        product.setStockQuantity(1);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));

        assertThrows(InsufficientStockException.class, () -> {
            orderService.checkout(1L, validOrderRequest);
        });

        verify(orderRepository, never()).save(any());
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar BusinessRuleException quando o carrinho estiver vazio")
    void testCheckoutWithEmptyCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of());

        assertThrows(BusinessRuleException.class, () -> {
            orderService.checkout(1L, validOrderRequest);
        });

        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve registrar pedido REJECTED quando cartão de crédito terminar em 0000 sem baixar estoque")
    void testCheckoutWithRejectedCreditCard() {
        CreateOrderRequest rejectedCardRequest = new CreateOrderRequest(
                "Dona Marta",
                "Rua do Sol",
                "123",
                "Centro",
                "São Luís",
                "MA",
                "65000-000",
                PaymentMethod.CARTAO_CREDITO,
                "4000 1234 5678 0000",
                "Marta Silva",
                "12/28",
                "123",
                1
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponseDto response = orderService.checkout(1L, rejectedCardRequest);

        assertNotNull(response);
        assertEquals(OrderStatus.REJECTED, response.status());
        assertNotNull(response.failureReason());

        assertEquals(15, product.getStockQuantity());
        verify(productRepository, never()).save(product);

        verify(cartItemRepository, never()).deleteByUserId(1L);
    }
}
