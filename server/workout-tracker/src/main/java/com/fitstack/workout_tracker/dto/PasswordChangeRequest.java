package com.fitstack.workout_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordChangeRequest {

    @NotBlank(message = "required")
    @Size(min = 8, max = 100, message = "must be at least 8 characters")
    private String currentPassword;

    @NotBlank(message = "required")
    @Size(min = 8, max = 100, message = "must be at least 8 characters")
    private String newPassword;
}
