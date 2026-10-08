package com.grupomateus.supermarket.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponseDto(
        List<CartItemResponseDto> items,
        BigDecimal subtotal,
        Integer totalItems
) {
    public static CartResponseDto of(List<CartItemResponseDto> items) {
        BigDecimal subtotal = items.stream()
                .map(CartItemResponseDto::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalQuantity = items.stream()
                .mapToInt(CartItemResponseDto::quantity)
                .sum();
        return new CartResponseDto(items, subtotal, totalQuantity);
    }
}
