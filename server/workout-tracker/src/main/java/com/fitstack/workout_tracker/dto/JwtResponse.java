package com.fitstack.workout_tracker.dto;

import com.fitstack.workout_tracker.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private User user;
}
