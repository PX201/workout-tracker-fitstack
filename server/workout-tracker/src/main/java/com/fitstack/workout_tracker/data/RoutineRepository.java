package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.models.Routine;

import java.util.List;

public interface RoutineRepository {
    List<Routine> findAll();

    Routine findById(int routineId);

    Routine add(Routine routine);

    boolean update(Routine routine);

    boolean deleteById(int routineId);
}
