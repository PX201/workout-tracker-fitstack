package com.fitstack.workout_tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @NotBlank(message = " is required")
    @Size(min = 5, max = 50, message = " must be between 5 and 50 characters")
    private String username;

    @NotBlank(message = " is required")
    @Email(message = " must be valid")
    private String email;


}
