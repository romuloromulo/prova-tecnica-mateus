package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.ProductResponseDto;
import com.grupomateus.supermarket.exception.ResourceNotFoundException;
import com.grupomateus.supermarket.model.Product;
import com.grupomateus.supermarket.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponseDto> listProducts(String category, String search, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(category, search, pageable);
        return products.map(ProductResponseDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o ID: " + id));
        return ProductResponseDto.fromEntity(product);
    }
}
