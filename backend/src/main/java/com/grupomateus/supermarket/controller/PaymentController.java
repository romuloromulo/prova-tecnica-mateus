package com.grupomateus.supermarket.controller;

import com.grupomateus.supermarket.dto.OrderResponseDto;
import com.grupomateus.supermarket.dto.PaymentSimulationRequest;
import com.grupomateus.supermarket.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Pagamentos e Simulação", description = "Endpoints de simulação de transações e transição de status")
public class PaymentController {

    private final OrderService orderService;

    @PostMapping("/simulate")
    @Operation(summary = "Simular aprovação ou rejeição de pagamento", description = "Permite simular webhook de pagamento PIX ou análise de crédito.")
    public ResponseEntity<OrderResponseDto> simulatePayment(@RequestBody PaymentSimulationRequest request) {
        OrderResponseDto response = orderService.simulatePayment(request);
        return ResponseEntity.ok(response);
    }
}
