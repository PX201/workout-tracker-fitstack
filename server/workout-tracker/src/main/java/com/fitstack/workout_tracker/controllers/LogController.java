package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.LogService;
import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.RoutineService;
import com.fitstack.workout_tracker.models.Log;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.Routine;
import com.fitstack.workout_tracker.models.User;
import com.fitstack.workout_tracker.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/log")
@CrossOrigin
public class LogController {

    LogService service;
    RoutineService routineService;

    // USER
    // less likely to use
    @GetMapping("/user/routine/{routineId}")
    public ResponseEntity<?> findByRoutineId(@PathVariable int routineId, Authentication auth) {
        Long currentUserId = AuthUtil.getUserId(auth);
        if (currentUserId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Routine routine = routineService.findById(routineId);
        if (routine == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (routine.getUserId() != currentUserId) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        List<Log> logs = service.findByRoutineId(routineId);
        return ResponseEntity.ok(logs);
    }


    @GetMapping("/user/me")
    public ResponseEntity<?> findMyLogs(Authentication auth) {
        Long currentUserId = AuthUtil.getUserId(auth);
        if (currentUserId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Log> logs = service.findByUserId(currentUserId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/user")
    public ResponseEntity<Object> add(@RequestBody Log log, Authentication auth) {
        Long currentUserId = AuthUtil.getUserId(auth);
        if (currentUserId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Routine routine = routineService.findById(log.getRoutineId());
        if (routine == null) {
            return new ResponseEntity<>("Routine not found", HttpStatus.NOT_FOUND);
        }
        if (routine.getUserId() != currentUserId) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Result<Log> result = service.addLog(log);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }


    @PutMapping("/user/{logId}")
    public ResponseEntity<Object> update(@PathVariable int logId, @RequestBody Log log, Authentication auth) {
        // simple mismatch check
        if (logId != log.getLogId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        // find user who sent request
        User user = AuthUtil.getUser(auth);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        // find log they want to update, will need to find its routine and who created it
        Log existingLog = service.findByLogId(logId);
        if (existingLog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // if they're just a user, they can't edit others' logs. So find the routine
        // the log is based on, and make sure they made that routine
        if (!user.hasRole(Role.ADMIN)) {
            Routine routine = routineService.findById(existingLog.getRoutineId());
            if (routine == null || routine.getUserId() != user.getUserId()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        Result<Log> result = service.updateLog(log);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/user/{logId}")
    public ResponseEntity<Void> deleteById(@PathVariable int logId, Authentication auth) {
        // find user sending request
        User user = AuthUtil.getUser(auth);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        // get the log
        Log existingLog = service.findByLogId(logId);
        if (existingLog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // if their not an admin, find log's referenced routine and make sure they created it
        if (!user.hasRole(Role.ADMIN)) {
            Routine routine = routineService.findById(existingLog.getRoutineId());
            if (routine == null || routine.getUserId() != user.getUserId()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        if (service.deleteLog(logId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ADMIN
    @GetMapping("/admin")
    public ResponseEntity<?> findAll(Authentication auth) {
        User user = AuthUtil.getUser(auth);
        if (user == null || !user.hasRole(Role.ADMIN)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(service.findAll());
    }
}
