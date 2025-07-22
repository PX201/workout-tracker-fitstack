package com.fitstack.workout_tracker.controllers;

import com.fitstack.workout_tracker.domain.LogService;
import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.models.Log;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/log")
@CrossOrigin
public class LogController {

    LogService service;

    // USER
    @GetMapping("/user/routine/{routineId}")
    public List<Log> findByRoutineId(@PathVariable int routineId) {
        return service.findByRoutineId(routineId);
    }

    @GetMapping("/user/{userId}")
    public List<Log> findByUserId(@PathVariable int userId) {
        return service.findByUserId(userId);
    }


    @PostMapping("/user")
    public ResponseEntity<Object> add(@RequestBody Log log) {
        Result<Log> result = service.addLog(log);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/user/{logId}")
    public ResponseEntity<Object> update(@PathVariable int logId, @RequestBody Log log) {
        if (logId != log.getLogId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Result<Log> result = service.updateLog(log);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/user/{logId}")
    public ResponseEntity<Void> deleteById(@PathVariable int logId) {
        if (service.deleteLog(logId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ADMIN
    @GetMapping("/admin")
    public List<Log> findAll() {
        return service.findAll();
    }
}
