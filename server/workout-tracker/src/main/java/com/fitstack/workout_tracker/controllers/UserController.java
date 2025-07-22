package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.UserService;
import com.fitstack.workout_tracker.dto.PasswordChangeRequest;
import com.fitstack.workout_tracker.dto.UserUpdateRequest;
import com.fitstack.workout_tracker.models.User;
import com.fitstack.workout_tracker.utils.AuthUtil;
import com.fitstack.workout_tracker.utils.ErrorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController

@RequiredArgsConstructor
@RequestMapping("/api/")
public class UserController {

    private final UserService userService;


    @GetMapping("user/me")
    public User getUserInfo(Authentication auth){
        return AuthUtil.getUser(auth);
    }

    @PutMapping("user/me")
    public ResponseEntity<?> updateBasicInfo(@Valid @RequestBody UserUpdateRequest request){
        Result<User> result = userService.updateBasicInfo(request);
        if(!result.isSuccess()){
            return ErrorResponse.build(result);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }


    @PutMapping("user/me/changepassword")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest request, Authentication auth){
        User currentUser = AuthUtil.getUser(auth);
        Result<Void> result = userService.changePassword(currentUser, request);
        if(!result.isSuccess()){
            return ErrorResponse.build(result);
        }
        return ResponseEntity.ok().build();
    }





}
