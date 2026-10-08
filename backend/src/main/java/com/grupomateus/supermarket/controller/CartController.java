package com.grupomateus.supermarket.controller;

import com.grupomateus.supermarket.dto.AddToCartRequest;
import com.grupomateus.supermarket.dto.CartResponseDto;
import com.grupomateus.supermarket.dto.UpdateCartItemRequest;
import com.grupomateus.supermarket.model.User;
import com.grupomateus.supermarket.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Carrinho de Compras", description = "Endpoints de gerenciamento do carrinho sincronizado por usuário")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Obter carrinho atual", description = "Retorna todos os itens do carrinho do usuário autenticado e subtotais.")
    public ResponseEntity<CartResponseDto> getCart(@AuthenticationPrincipal User user) {
        CartResponseDto cart = cartService.getCart(user.getId());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    @Operation(summary = "Adicionar item ao carrinho", description = "Adiciona produto ao carrinho validando estoque disponível em tempo real.")
    public ResponseEntity<CartResponseDto> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartResponseDto cart = cartService.addToCart(user.getId(), request);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/sync")
    @Operation(summary = "Sincronizar carrinho local", description = "Recebe a lista de produtos do carrinho mantidos em cache local e consolida no servidor.")
    public ResponseEntity<CartResponseDto> syncCart(
            @AuthenticationPrincipal User user,
            @RequestBody com.grupomateus.supermarket.dto.SyncCartRequest request
    ) {
        CartResponseDto cart = cartService.syncCart(user.getId(), request);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Atualizar quantidade de item", description = "Altera a quantidade de um item existente no carrinho com checagem de estoque.")
    public ResponseEntity<CartResponseDto> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartResponseDto cart = cartService.updateQuantity(user.getId(), id, request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remover item do carrinho", description = "Remove um item específico do carrinho do usuário.")
    public ResponseEntity<CartResponseDto> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        CartResponseDto cart = cartService.removeFromCart(user.getId(), id);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    @Operation(summary = "Esvaziar carrinho", description = "Limpa completamente todos os itens do carrinho do usuário.")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.noContent().build();
    }
}
