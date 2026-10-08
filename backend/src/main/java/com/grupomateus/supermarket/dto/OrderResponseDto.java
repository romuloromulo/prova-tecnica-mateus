package com.grupomateus.supermarket.dto;

import com.grupomateus.supermarket.model.Order;
import com.grupomateus.supermarket.model.OrderStatus;
import com.grupomateus.supermarket.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDto(
        Long id,
        String orderNumber,
        BigDecimal subtotal,
        BigDecimal deliveryFee,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        OrderStatus status,
        String failureReason,
        String recipientName,
        String street,
        String number,
        String neighborhood,
        String city,
        String state,
        String cep,
        LocalDateTime createdAt,
        List<OrderItemResponseDto> items
) {
    public static OrderResponseDto fromEntity(Order order) {
        List<OrderItemResponseDto> itemDtos = order.getItems().stream()
                .map(OrderItemResponseDto::fromEntity)
                .toList();

        return new OrderResponseDto(
                order.getId(),
                order.getOrderNumber(),
                order.getSubtotal(),
                order.getDeliveryFee(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getStatus(),
                order.getFailureReason(),
                order.getRecipientName(),
                order.getStreet(),
                order.getNumber(),
                order.getNeighborhood(),
                order.getCity(),
                order.getState(),
                order.getCep(),
                order.getCreatedAt(),
                itemDtos
        );
    }
}
