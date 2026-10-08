package com.grupomateus.supermarket.dto;

import com.grupomateus.supermarket.model.CartItem;

import java.math.BigDecimal;

public record CartItemResponseDto(
        Long id,
        Long productId,
        String productName,
        String productCategory,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal,
        String imageUrl,
        Integer stockQuantity
) {
    public static CartItemResponseDto fromEntity(CartItem item) {
        BigDecimal subtotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponseDto(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getCategory(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                subtotal,
                item.getProduct().getImageUrl(),
                item.getProduct().getStockQuantity()
        );
    }
}
