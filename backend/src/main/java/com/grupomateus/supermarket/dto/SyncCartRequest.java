package com.grupomateus.supermarket.dto;

import java.util.List;

public record SyncCartRequest(
        List<AddToCartRequest> items
) {}
