package com.grupomateus.supermarket.dto;

import com.grupomateus.supermarket.model.OrderStatus;

public record PaymentSimulationRequest(
        String orderId,
        OrderStatus simulateStatus,
        String rejectionReason
) {}
