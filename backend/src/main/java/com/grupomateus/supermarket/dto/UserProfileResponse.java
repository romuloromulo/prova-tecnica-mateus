package com.grupomateus.supermarket.dto;

import java.math.BigDecimal;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String phone,
        BigDecimal caderninhoLimit
) {}
