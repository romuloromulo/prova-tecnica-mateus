package com.grupomateus.supermarket.event;

import java.math.BigDecimal;
public record OrderItemEvent(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
) {}
