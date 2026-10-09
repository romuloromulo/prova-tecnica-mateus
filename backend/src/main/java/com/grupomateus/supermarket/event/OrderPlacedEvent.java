package com.grupomateus.supermarket.event;

import com.grupomateus.supermarket.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Evento de domínio imutável publicado no Apache Kafka quando um pedido é criado com sucesso.
 * Permite processamento assíncrono por serviços desacoplados (Notificações, WMS/Logística, etc).
 */
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
