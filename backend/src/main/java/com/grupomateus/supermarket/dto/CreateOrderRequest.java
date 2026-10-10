package com.grupomateus.supermarket.dto;

import com.grupomateus.supermarket.model.PaymentMethod;
import java.math.BigDecimal;

public record CreateOrderRequest(
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
        Integer installments,

        ShippingAddressDto shippingAddress,
        CreditCardDto cardData,

        String deliveryType,
        BigDecimal deliveryFee,
        BigDecimal discountAmount,
        String couponCode
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
             creditCardCvv, installments, null, null, null, null, null, null);
    }

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
            Integer installments,
            ShippingAddressDto shippingAddress,
            CreditCardDto cardData
    ) {
        this(recipientName, street, number, neighborhood, city, state, cep,
             paymentMethod, creditCardNumber, creditCardHolder, creditCardExpiry,
             creditCardCvv, installments, shippingAddress, cardData, null, null, null, null);
    }

    public CreateOrderRequest(ShippingAddressDto shippingAddress, PaymentMethod paymentMethod, CreditCardDto cardData) {
        this(null, null, null, null, null, null, null,
             paymentMethod, null, null, null, null, null,
             shippingAddress, cardData, null, null, null, null);
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
