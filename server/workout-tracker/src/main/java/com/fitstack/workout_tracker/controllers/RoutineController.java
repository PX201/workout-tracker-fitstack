package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.RoutineService;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.Routine;
import com.fitstack.workout_tracker.models.User;
import com.fitstack.workout_tracker.utils.AuthUtil;
import com.fitstack.workout_tracker.utils.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api")
public class RoutineController {

    @Autowired
    RoutineService routineService;

    // USER OPERATIONS
    @GetMapping("/user/me/routine")
    public ResponseEntity<?> findMyRoutines(Authentication auth) {
        Long userId = AuthUtil.getUserId(auth);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized: user ID not found in authentication.");
        }
        List<Routine> routines = routineService.findByUserId(userId);
        return ResponseEntity.ok(routines);
    }

    //@GetMapping("/user/{userId}/routine/{routineId}")
    //public Routine findByRoutineIdUser(@PathVariable long routineId) { return routineService.findById(routineId); }

    @PostMapping("/user/me/routine")
    public ResponseEntity<?> addRoutineUser(@RequestBody Routine routine, Authentication auth) {
        Long userId = AuthUtil.getUserId(auth);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        routine.setUserId(userId); // assign (override) anything client may have sent
        Result<Routine> result = routineService.addRoutine(routine);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/user/me/routine/{routineId}")
    public ResponseEntity<Object> updateRoutineUser(@PathVariable long routineId, @RequestBody Routine routine, Authentication auth) {
        User currentUser = AuthUtil.getUser(auth);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (routineId != routine.getRoutineId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Routine existing = routineService.findById(routineId);
        if (existing == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!currentUser.hasRole(Role.ADMIN)) {
            if (existing.getUserId() != currentUser.getUserId()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            routine.setUserId(existing.getUserId());
        }
        Result<Routine> result = routineService.updateRoutine(routine);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/user/routine/{routineId}")
    public ResponseEntity<Void> deleteByIdUser(@PathVariable long routineId, Authentication auth) {
        User currentUser = AuthUtil.getUser(auth);
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Routine existing = routineService.findById(routineId);
        if (existing == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!currentUser.hasRole(Role.ADMIN) && existing.getUserId() != currentUser.getUserId()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if (routineService.deleteRoutine(routineId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    // ADMIN OPERATIONS
    @GetMapping("/admin/routine")
    public ResponseEntity<?> findAll(Authentication auth) {
        User user = AuthUtil.getUser(auth);
        if (user == null || !user.hasRole(Role.ADMIN)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(routineService.findAll());
    }
}
