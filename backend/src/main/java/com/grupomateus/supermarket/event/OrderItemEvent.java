package com.grupomateus.supermarket.event;

import java.math.BigDecimal;

/**
 * Evento representando um item incluído no pedido publicado no Apache Kafka.
 */
public record OrderItemEvent(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
) {}
