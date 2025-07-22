package com.fitstack.workout_tracker.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Result<T> {
    private final List<String> messages = new ArrayList<>();
    private ResultType type = ResultType.SUCCESS;

    @Setter
    private T payload;

    public boolean isSuccess() {
        return type == ResultType.SUCCESS;
    }

    public List<String> getMessages() {
        return new ArrayList<>(messages);
    }

    public void addMessage(String message, ResultType type) {
        messages.add(message);
        this.type = type;
    }

    public void addErrorMessage(String message) {
        addMessage(message, ResultType.INVALID);
    }

    public static <T> Result<T> success(T payload) {
        Result<T> result = new Result<>();
        result.setPayload(payload);
        return result;
    }
}
