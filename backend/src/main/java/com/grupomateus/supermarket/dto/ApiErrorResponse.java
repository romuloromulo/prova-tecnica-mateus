package com.grupomateus.supermarket.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ApiErrorResponse(
        int status,
        String error,
        String message,
        LocalDateTime timestamp,
        List<String> details
) {
    public ApiErrorResponse(int status, String error, String message) {
        this(status, error, message, LocalDateTime.now(), List.of());
    }

    public ApiErrorResponse(int status, String error, String message, List<String> details) {
        this(status, error, message, LocalDateTime.now(), details);
    }
}
