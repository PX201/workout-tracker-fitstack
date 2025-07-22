package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.models.Log;

import java.util.List;

public interface LogRepository {
    List<Log> findAll();

    List<Log> findByUserId(long userId);

    List<Log> findByRoutineId(long routineId);

    Log findById(long logId);

    Log add(Log log);

    boolean update(Log log);

    boolean deleteById(long logId);
}
