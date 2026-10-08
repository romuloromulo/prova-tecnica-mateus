package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.*;
import com.grupomateus.supermarket.exception.InsufficientStockException;
import com.grupomateus.supermarket.exception.ResourceNotFoundException;
import com.grupomateus.supermarket.model.CartItem;
import com.grupomateus.supermarket.model.Product;
import com.grupomateus.supermarket.model.User;
import com.grupomateus.supermarket.repository.CartItemRepository;
import com.grupomateus.supermarket.repository.ProductRepository;
import com.grupomateus.supermarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponseDto getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        List<CartItemResponseDto> itemDtos = items.stream()
                .map(CartItemResponseDto::fromEntity)
                .toList();
        return CartResponseDto.of(itemDtos);
    }

    @Transactional
    public CartResponseDto addToCart(Long userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o ID: " + request.productId()));

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .orElse(null);

        int totalRequestedQuantity = request.quantity();
        if (item != null) {
            totalRequestedQuantity += item.getQuantity();
        }

        if (totalRequestedQuantity > product.getStockQuantity()) {
            throw new InsufficientStockException(product.getName(), totalRequestedQuantity, product.getStockQuantity());
        }

        if (item != null) {
            item.setQuantity(totalRequestedQuantity);
            cartItemRepository.save(item);
        } else {
            User user = userRepository.getReferenceById(userId);
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(userId);
    }

    @Transactional
    public CartResponseDto syncCart(Long userId, SyncCartRequest request) {
        if (request != null && request.items() != null) {
            for (AddToCartRequest item : request.items()) {
                addToCart(userId, item);
            }
        }
        return getCart(userId);
    }

    @Transactional
    public CartResponseDto updateQuantity(Long userId, Long cartItemIdOrProductId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(cartItemIdOrProductId)
                .filter(ci -> ci.getUser().getId().equals(userId))
                .or(() -> cartItemRepository.findByUserIdAndProductId(userId, cartItemIdOrProductId))
                .orElseThrow(() -> new ResourceNotFoundException("Item do carrinho não encontrado com o ID: " + cartItemIdOrProductId));

        Product product = item.getProduct();
        if (request.quantity() > product.getStockQuantity()) {
            throw new InsufficientStockException(product.getName(), request.quantity(), product.getStockQuantity());
        }

        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Transactional
    public CartResponseDto removeFromCart(Long userId, Long cartItemIdOrProductId) {
        CartItem item = cartItemRepository.findById(cartItemIdOrProductId)
                .filter(ci -> ci.getUser().getId().equals(userId))
                .or(() -> cartItemRepository.findByUserIdAndProductId(userId, cartItemIdOrProductId))
                .orElseThrow(() -> new ResourceNotFoundException("Item do carrinho não encontrado com o ID: " + cartItemIdOrProductId));

        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
