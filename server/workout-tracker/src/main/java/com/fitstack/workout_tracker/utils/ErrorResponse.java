package com.fitstack.workout_tracker.utils;

import com.fitstack.workout_tracker.domain.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class ErrorResponse {
    public static <T> ResponseEntity<Object> build(Result<T> result) {
        HttpStatus status = switch (result.getType()) {
            case INVALID -> HttpStatus.BAD_REQUEST;
            case NOT_FOUND -> HttpStatus.NOT_FOUND;
            case UNAUTHORIZED -> HttpStatus.UNAUTHORIZED;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("messages", result.getMessages());

        return new ResponseEntity<>(body, status);
    }

    public static ResponseEntity<Object> build(String message, HttpStatus status) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("message", message);
        return new ResponseEntity<>(error, status);
    }
}
