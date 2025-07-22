package com.fitstack.workout_tracker.models;

import lombok.Getter;

@Getter
public enum Muscle {
    TRAPEZIUS(1, "trapezius"),
    UPPER_BACK(2, "upper-back"),
    LOWER_BACK(3, "lower-back"),
    CHEST(4, "chest"),
    BICEPS(5, "biceps"),
    TRICEPS(6, "triceps"),
    FOREARM(7, "forearm"),
    BACK_DELTOIDS(8, "back-deltoids"),
    FRONT_DELTOIDS(9, "front-deltoids"),
    ABS(10, "abs"),
    OBLIQUES(11, "obliques"),
    ADDUCTOR(12, "adductor"),
    ABDUCTORS(13, "abductors"),
    HAMSTRING(14, "hamstring"),
    QUADRICEPS(15, "quadriceps"),
    CALVES(16, "calves"),
    GLUTEAL(17, "gluteal"),
    HEAD(18, "head"),
    NECK(19, "neck"),
    KNEES(20, "knees"),
    LEFT_SOLEUS(21, "left-soleus"),
    RIGHT_SOLEUS(22, "right-soleus");

    private final int id;
    private final String displayName;

    Muscle(int id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }

    public static Muscle fromId(int id) {
        for (Muscle muscle : values()) {
            if (muscle.id == id) {
                return muscle;
            }
        }
        throw new IllegalArgumentException("Invalid Muscle ID: " + id);
    }
}