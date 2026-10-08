package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.ProductResponseDto;
import com.grupomateus.supermarket.exception.ResourceNotFoundException;
import com.grupomateus.supermarket.model.Product;
import com.grupomateus.supermarket.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    @DisplayName("Deve buscar produtos paginados com filtro de busca")
    void testListProducts() {
        Product p = Product.builder()
                .id(1L)
                .name("Banana Prata")
                .category("HORTIFRUTI")
                .price(new BigDecimal("6.99"))
                .stockQuantity(50)
                .build();

        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(p));

        when(productRepository.searchProducts("HORTIFRUTI", "Banana", pageable)).thenReturn(page);

        Page<ProductResponseDto> result = productService.listProducts("HORTIFRUTI", "Banana", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Banana Prata", result.getContent().get(0).name());
    }

    @Test
    @DisplayName("Deve buscar produto por ID com sucesso")
    void testGetProductByIdSuccess() {
        Product p = Product.builder()
                .id(1L)
                .name("Banana Prata")
                .category("HORTIFRUTI")
                .price(new BigDecimal("6.99"))
                .stockQuantity(50)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        ProductResponseDto result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Banana Prata", result.name());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao buscar produto inexistente")
    void testGetProductByIdNotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById(999L);
        });
    }
}
