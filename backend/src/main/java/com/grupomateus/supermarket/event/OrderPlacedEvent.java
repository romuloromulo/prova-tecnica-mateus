package com.grupomateus.supermarket.event;

import com.grupomateus.supermarket.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public record OrderPlacedEvent(
        Long orderId,
        String orderNumber,
        Long customerId,
        String customerName,
        String customerEmail,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        String deliveryAddress,
        List<OrderItemEvent> items,
        LocalDateTime createdAt
) {}
