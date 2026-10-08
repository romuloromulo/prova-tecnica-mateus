package com.grupomateus.supermarket.dto;

public record ShippingAddressDto(
        String recipientName,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        String cep
) {}
