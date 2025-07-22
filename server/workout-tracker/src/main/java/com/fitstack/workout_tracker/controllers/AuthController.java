package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.UserService;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    UserService userService;

    @PostMapping("register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request){
        User user = userService.register(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }


}
