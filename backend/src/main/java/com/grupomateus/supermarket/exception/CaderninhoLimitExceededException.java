package com.grupomateus.supermarket.exception;

import java.math.BigDecimal;

public class CaderninhoLimitExceededException extends BusinessRuleException {
    public CaderninhoLimitExceededException(BigDecimal availableLimit, BigDecimal totalOrder) {
        super(String.format("Limite disponível no Caderninho (R$ %.2f) é insuficiente para o total do pedido (R$ %.2f).",
                availableLimit, totalOrder));
    }
}
