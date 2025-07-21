package com.fitstack.workout_tracker.models;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Routine {
    private int routineId;
    private int userId;
    private String title;
    private List<Muscle> muscles = new ArrayList<>();
}
