package com.fitstack.workout_tracker.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Log {
    private long logId;
    private long routineId;
    private String routineTitle;
    private LocalDate date;
    private int duration;
    private int intensity;
    private String notes;
}
