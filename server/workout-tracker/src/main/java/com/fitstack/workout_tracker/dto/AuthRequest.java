package com.fitstack.workout_tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {

    @NotBlank(message = "Required")
    @Email(message = "Invalid")
    private String email;

    @NotBlank(message = "Required")
    @Size(min = 8, max = 100, message = "Invalid")
    private String password;
}
