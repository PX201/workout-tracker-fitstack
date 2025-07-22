package com.fitstack.workout_tracker.exception;

import com.fitstack.workout_tracker.utils.ErrorResponse;
import com.fitstack.workout_tracker.domain.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleOther(Exception ex) {
        return ErrorResponse.build("Unexpected error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
        Result<Object> result = new Result<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
                result.addErrorMessage(err.getField() + ": " + err.getDefaultMessage()));
        return ErrorResponse.build(result);
    }

    public ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex){
        return ErrorResponse.build(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

}
