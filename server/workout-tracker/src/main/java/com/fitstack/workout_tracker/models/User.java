package com.fitstack.workout_tracker.models;

import lombok.Data;

import java.time.LocalDate;

@Data
public class User {


    private long userId;


    private String username;


    private String email;

    private String password;

    private Role role;

    private LocalDate dateJoined;

    private boolean isActive;

    private boolean hasRole(Role role){
        if(this.role == null) return false;
        return this.role == role;
    }




}
