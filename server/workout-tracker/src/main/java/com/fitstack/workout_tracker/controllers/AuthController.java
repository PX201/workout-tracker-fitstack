package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.UserService;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.User;
import com.fitstack.workout_tracker.utils.ErrorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request){
        Result<User> result = userService.register(request);
        if (!result.isSuccess()) {
            return ErrorResponse.build(result);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }


}
