package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.models.Muscle;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class MuscleController {

    @GetMapping("/api/muscles")
    public List<String> findAllMuscles(){
        return Arrays.stream(Muscle.values()).map(Enum::name).toList();
    }
}
