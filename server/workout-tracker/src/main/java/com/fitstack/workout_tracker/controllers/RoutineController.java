package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.RoutineService;
import com.fitstack.workout_tracker.models.Routine;
import com.fitstack.workout_tracker.utils.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/routine")
public class RoutineController {

    @Autowired
    RoutineService routineService;

    @GetMapping
    public List<Routine> findAll() { return routineService.findAll(); }

    @GetMapping("/user/{userId}")
    public List<Routine> findByUserId(@PathVariable long userId) { return routineService.findByUserId(userId); }

    @GetMapping("{routineId}")
    public Routine findById(@PathVariable long routineId) { return routineService.findById(routineId); }

    @PostMapping
    public ResponseEntity<?> addRoutine(@RequestBody Routine routine) {
        Result<Routine> result = routineService.addRoutine(routine);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/{routineId}")
    public ResponseEntity<Object> updateRoutine(@PathVariable int routineId, @RequestBody Routine routine) {
        if (routineId != routine.getRoutineId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Result<Routine> result = routineService.updateRoutine(routine);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/{routineId}")
    public ResponseEntity<Void> deleteById(@PathVariable int routineId) {
        if (routineService.deleteRoutine(routineId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
