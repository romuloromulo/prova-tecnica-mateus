package com.grupomateus.supermarket.exception;

public class InsufficientStockException extends BusinessRuleException {
    public InsufficientStockException(String productName, int requestedQuantity, int availableStock) {
        super(String.format("Estoque insuficiente para o produto '%s'. Solicitado: %d, Disponível: %d.",
                productName, requestedQuantity, availableStock));
    }
}
