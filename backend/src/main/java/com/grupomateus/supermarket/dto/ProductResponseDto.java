package com.grupomateus.supermarket.dto;

import com.grupomateus.supermarket.model.Product;

import java.math.BigDecimal;

public record ProductResponseDto(
        Long id,
        String name,
        String description,
        String category,
        BigDecimal price,
        Integer stockQuantity,
        String imageUrl
) {
    public static ProductResponseDto fromEntity(Product p) {
        return new ProductResponseDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getCategory(),
                p.getPrice(),
                p.getStockQuantity(),
                p.getImageUrl()
        );
    }
}
