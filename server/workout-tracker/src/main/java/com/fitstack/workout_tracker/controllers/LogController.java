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

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api")
@CrossOrigin
public class LogController {

    private final LogService service;
    private final RoutineService routineService;

    // USER
    @GetMapping("/user/log/routine/{routineId}")
    public ResponseEntity<?> findByRoutineId(@PathVariable int routineId, Authentication auth) {
        Long currentUserId = AuthUtil.getUserId(auth);
        if (currentUserId == null) {
            return new ResponseEntity<>("Null user. Unauthorized.", HttpStatus.UNAUTHORIZED);
        }
        Routine routine = routineService.findById(routineId);
        if (routine == null) {
            return new ResponseEntity<>("No logs found for that routine.", HttpStatus.NOT_FOUND);
        }
        if (routine.getUserId() != currentUserId) {
            return new ResponseEntity<>("Forbidden. That is not your own routine ID.", HttpStatus.FORBIDDEN);
        }
        List<Log> logs = service.findByRoutineId(routineId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/user/log/me")
    public ResponseEntity<?> findMyLogs(Authentication auth) {
        Long currentUserId = AuthUtil.getUserId(auth);
        if (currentUserId == null) {
            return new ResponseEntity<>("Null user. Unauthorized.", HttpStatus.UNAUTHORIZED);
        }
        List<Log> logs = service.findByUserId(currentUserId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/user/log")
    public ResponseEntity<Object> add(@RequestBody Log log, Authentication auth) {
        Long currentUserId = AuthUtil.getUserId(auth);
        if (currentUserId == null) {
            return new ResponseEntity<>("Null user. Unauthorized.", HttpStatus.UNAUTHORIZED);
        }
        Routine routine = routineService.findById(log.getRoutineId());
        if (routine == null) {
            return new ResponseEntity<>("Routine not found", HttpStatus.NOT_FOUND);
        }
        if (routine.getUserId() != currentUserId) {
            return new ResponseEntity<>("You can only add logs for your own routines.", HttpStatus.FORBIDDEN);
        }
        log.setDate(LocalDate.now());
        Result<Log> result = service.addLog(log);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/user/log/{logId}")
    public ResponseEntity<Object> update(@PathVariable int logId, @RequestBody Log log, Authentication auth) {
        // simple mismatch check
        if (logId != log.getLogId()) {
            return new ResponseEntity<>("Mismatch", HttpStatus.CONFLICT);
        }
        // find user who sent request
        User user = AuthUtil.getUser(auth);
        if (user == null) {
            return new ResponseEntity<>("Null user", HttpStatus.UNAUTHORIZED);
        }
        // find log they want to update, will need to find its routine and who created it
        Log existingLog = service.findByLogId(logId);
        if (existingLog == null) {
            return new ResponseEntity<>("Log not found.", HttpStatus.NOT_FOUND);
        }
        // if they're just a user, they can't edit others' logs. So find the routine
        // the log is based on, and make sure they made that routine
        if (!user.hasRole(Role.ADMIN)) {
            // existing log routine must be theirs
            Routine currentRoutine = routineService.findById(existingLog.getRoutineId());
            if (currentRoutine == null || currentRoutine.getUserId() != user.getUserId()) {
                return new ResponseEntity<>("Routine is not yours, or null.", HttpStatus.FORBIDDEN);
            }

            // new routine assignment must also be theirs
            Routine newRoutine = routineService.findById(log.getRoutineId());
            if (newRoutine == null || newRoutine.getUserId() != user.getUserId()) {
                return new ResponseEntity<>("Only an admin can reassign log to use someone else's routine. This would change ownership of the log.", HttpStatus.FORBIDDEN);
            }
        }

        Result<Log> result = service.updateLog(log);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/user/log/{logId}")
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
    @GetMapping("/admin/log")
    public ResponseEntity<?> findAll(Authentication auth) {
        User user = AuthUtil.getUser(auth);
        if (user == null || !user.hasRole(Role.ADMIN)) {
            return new ResponseEntity<>("Admins only.", HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(service.findAll());
    }
}
