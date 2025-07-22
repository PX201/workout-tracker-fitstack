package com.fitstack.workout_tracker.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Routine {
    private long routineId;
    private long userId;
    private String title;
    private List<Muscle> muscles = new ArrayList<>();
}
