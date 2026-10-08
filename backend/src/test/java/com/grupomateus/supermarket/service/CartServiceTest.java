package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.AddToCartRequest;
import com.grupomateus.supermarket.dto.CartResponseDto;
import com.grupomateus.supermarket.dto.UpdateCartItemRequest;
import com.grupomateus.supermarket.exception.InsufficientStockException;
import com.grupomateus.supermarket.model.CartItem;
import com.grupomateus.supermarket.model.Product;
import com.grupomateus.supermarket.model.User;
import com.grupomateus.supermarket.repository.CartItemRepository;
import com.grupomateus.supermarket.repository.ProductRepository;
import com.grupomateus.supermarket.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Product product;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Pedro")
                .email("pedro@mateus.com")
                .build();

        product = Product.builder()
                .id(20L)
                .name("Leite Integral 1L")
                .category("BEBIDAS")
                .price(new BigDecimal("5.49"))
                .stockQuantity(10)
                .build();

        cartItem = CartItem.builder()
                .id(50L)
                .user(user)
                .product(product)
                .quantity(3)
                .build();
    }

    @Test
    @DisplayName("Deve adicionar produto ao carrinho quando houver estoque suficiente")
    void testAddToCartSuccess() {
        AddToCartRequest request = new AddToCartRequest(20L, 2);

        when(productRepository.findById(20L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserIdAndProductId(1L, 20L)).thenReturn(Optional.empty());
        when(userRepository.getReferenceById(1L)).thenReturn(user);
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));

        CartResponseDto result = cartService.addToCart(1L, request);

        assertNotNull(result);
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    @DisplayName("Deve lançar InsufficientStockException ao tentar adicionar quantidade superior ao estoque")
    void testAddToCartExceedingStock() {
        AddToCartRequest request = new AddToCartRequest(20L, 15);

        when(productRepository.findById(20L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserIdAndProductId(1L, 20L)).thenReturn(Optional.empty());

        assertThrows(InsufficientStockException.class, () -> {
            cartService.addToCart(1L, request);
        });

        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar InsufficientStockException ao atualizar quantidade para além do estoque")
    void testUpdateQuantityExceedingStock() {
        UpdateCartItemRequest request = new UpdateCartItemRequest(12);

        when(cartItemRepository.findById(50L)).thenReturn(Optional.of(cartItem));

        assertThrows(InsufficientStockException.class, () -> {
            cartService.updateQuantity(1L, 50L, request);
        });

        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve remover item do carrinho com sucesso")
    void testRemoveFromCartSuccess() {
        when(cartItemRepository.findById(50L)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of());

        CartResponseDto result = cartService.removeFromCart(1L, 50L);

        assertNotNull(result);
        assertEquals(0, result.items().size());
        verify(cartItemRepository, times(1)).delete(cartItem);
    }
}
