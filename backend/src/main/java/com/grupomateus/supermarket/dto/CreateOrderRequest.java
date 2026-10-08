package com.grupomateus.supermarket.dto;

import com.grupomateus.supermarket.model.PaymentMethod;

public record CreateOrderRequest(
        // Campos em formato plano
        String recipientName,
        String street,
        String number,
        String neighborhood,
        String city,
        String state,
        String cep,

        // Método de pagamento
        PaymentMethod paymentMethod,

        // Cartão em formato plano
        String creditCardNumber,
        String creditCardHolder,
        String creditCardExpiry,
        String creditCardCvv,
        Integer installments,

        // Objetos aninhados para compatibilidade total com o payload do frontend React
        ShippingAddressDto shippingAddress,
        CreditCardDto cardData
) {
    public CreateOrderRequest(
            String recipientName,
            String street,
            String number,
            String neighborhood,
            String city,
            String state,
            String cep,
            PaymentMethod paymentMethod,
            String creditCardNumber,
            String creditCardHolder,
            String creditCardExpiry,
            String creditCardCvv,
            Integer installments
    ) {
        this(recipientName, street, number, neighborhood, city, state, cep,
             paymentMethod, creditCardNumber, creditCardHolder, creditCardExpiry,
             creditCardCvv, installments, null, null);
    }

    public CreateOrderRequest(ShippingAddressDto shippingAddress, PaymentMethod paymentMethod, CreditCardDto cardData) {
        this(null, null, null, null, null, null, null,
             paymentMethod, null, null, null, null, null,
             shippingAddress, cardData);
    }
    public String getEffectiveRecipientName() {
        if (shippingAddress != null && shippingAddress.recipientName() != null) {
            return shippingAddress.recipientName();
        }
        return recipientName != null ? recipientName : "Cliente Mateus";
    }

    public String getEffectiveStreet() {
        if (shippingAddress != null && shippingAddress.street() != null) {
            return shippingAddress.street();
        }
        return street != null ? street : "Rua Principal";
    }

    public String getEffectiveNumber() {
        if (shippingAddress != null && shippingAddress.number() != null) {
            return shippingAddress.number();
        }
        return number != null ? number : "S/N";
    }

    public String getEffectiveNeighborhood() {
        if (shippingAddress != null && shippingAddress.neighborhood() != null) {
            return shippingAddress.neighborhood();
        }
        return neighborhood != null ? neighborhood : "Centro";
    }

    public String getEffectiveCity() {
        if (shippingAddress != null && shippingAddress.city() != null) {
            return shippingAddress.city();
        }
        return city != null ? city : "São Luís";
    }

    public String getEffectiveState() {
        if (shippingAddress != null && shippingAddress.state() != null) {
            return shippingAddress.state();
        }
        return state != null ? state : "MA";
    }

    public String getEffectiveCep() {
        if (shippingAddress != null && shippingAddress.cep() != null) {
            return shippingAddress.cep();
        }
        return cep != null ? cep : "65000-000";
    }

    public String getEffectiveCardNumber() {
        if (cardData != null && cardData.number() != null) {
            return cardData.number();
        }
        return creditCardNumber;
    }
}
