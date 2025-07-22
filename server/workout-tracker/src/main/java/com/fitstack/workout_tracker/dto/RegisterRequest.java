package com.fitstack.workout_tracker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = " is required")
    @Size(min = 5, max = 50, message = "must be between 5 and 50 characters")
    private String username;

    @NotBlank(message = "required")
    @Email(message = "must be valid")
    private String email;

    @NotBlank(message = "required")
    @Size(min = 8, max = 100, message = "must be at least 8 characters")
    private String password;
}
