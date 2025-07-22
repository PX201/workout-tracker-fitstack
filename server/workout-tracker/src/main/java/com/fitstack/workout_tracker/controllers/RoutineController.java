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
@RequestMapping("api")
public class RoutineController {

    @Autowired
    RoutineService routineService;

    // USER OPERATIONS
    @GetMapping("/user/{userId}/routine")
    public List<Routine> findByUserIdUser(@PathVariable long userId) { return routineService.findByUserId(userId); }

    //@GetMapping("/user/{userId}/routine/{routineId}")
    //public Routine findByRoutineIdUser(@PathVariable long routineId) { return routineService.findById(routineId); }

    @PostMapping("/user/routine")
    public ResponseEntity<?> addRoutineUser(@RequestBody Routine routine) {
        Result<Routine> result = routineService.addRoutine(routine);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/user/routine/{routineId}")
    public ResponseEntity<Object> updateRoutineUser(@PathVariable int routineId, @RequestBody Routine routine) {
        if (routineId != routine.getRoutineId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Result<Routine> result = routineService.updateRoutine(routine);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/user/routine/{routineId}")
    public ResponseEntity<Void> deleteByIdUser(@PathVariable int routineId) {
        if (routineService.deleteRoutine(routineId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    
    // ADMIN OPERATIONS
    @GetMapping("/admin/routine")
    public List<Routine> findAll() { return routineService.findAll(); }

    //@GetMapping("/admin/routine/{routineId}")
    //public Routine findByRoutineIdAdmin(@PathVariable long routineId) { return routineService.findById(routineId); }

//    @PutMapping("/admin/routine/{routineId}")
//    public ResponseEntity<Object> updateRoutineAdmin(@PathVariable int routineId, @RequestBody Routine routine) {
//        if (routineId != routine.getRoutineId()) {
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        }
//        Result<Routine> result = routineService.updateRoutine(routine);
//        if (result.isSuccess()) {
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }
//        return ErrorResponse.build(result);
//    }

//    @DeleteMapping("/admin/routine/{routineId}")
//    public ResponseEntity<Void> deleteByIdAdmin(@PathVariable int routineId) {
//        if (routineService.deleteRoutine(routineId)) {
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
}
