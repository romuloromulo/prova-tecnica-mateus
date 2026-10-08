package com.grupomateus.supermarket.dto;

import java.math.BigDecimal;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email,
        BigDecimal caderninhoLimit
) {
    public AuthResponse(String token, Long userId, String name, String email, BigDecimal caderninhoLimit) {
        this(token, "Bearer", userId, name, email, caderninhoLimit);
    }
}
