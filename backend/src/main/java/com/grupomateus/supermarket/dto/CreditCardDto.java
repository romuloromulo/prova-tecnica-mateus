package com.grupomateus.supermarket.dto;

public record CreditCardDto(
        String number,
        String holderName,
        String expiry,
        String cvv,
        Integer installments
) {}
