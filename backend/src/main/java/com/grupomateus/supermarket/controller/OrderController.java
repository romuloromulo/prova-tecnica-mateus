package com.grupomateus.supermarket.controller;

import com.grupomateus.supermarket.dto.CreateOrderRequest;
import com.grupomateus.supermarket.dto.OrderResponseDto;
import com.grupomateus.supermarket.model.User;
import com.grupomateus.supermarket.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Pedidos e Checkout", description = "Endpoints de finalização de compras, baixa de estoque e histórico de pedidos")
public class OrderController {

    private final OrderService orderService;

    @PostMapping({"", "/checkout"})
    @Operation(summary = "Finalizar pedido (Checkout)", description = "Executa a transação atômica de checkout: valida estoque, processa Caderninho ou Cartão/PIX, deduz estoque e limpa o carrinho.")
    public ResponseEntity<OrderResponseDto> checkout(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderResponseDto order = orderService.checkout(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    @Operation(summary = "Listar pedidos do usuário", description = "Retorna todos os pedidos realizados pelo usuário autenticado, ordenados do mais recente ao mais antigo.")
    public ResponseEntity<List<OrderResponseDto>> listOrders(@AuthenticationPrincipal User user) {
        List<OrderResponseDto> orders = orderService.listOrdersByUser(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Consultar detalhes do pedido", description = "Retorna os detalhes completos de um pedido específico pertencente ao usuário.")
    public ResponseEntity<OrderResponseDto> getOrder(
            @AuthenticationPrincipal User user,
            @PathVariable String orderNumber
    ) {
        OrderResponseDto order = orderService.getOrderByNumber(user.getId(), orderNumber);
        return ResponseEntity.ok(order);
    }
}
