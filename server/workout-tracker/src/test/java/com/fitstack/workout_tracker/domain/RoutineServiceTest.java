package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.RoutineRepository;
import com.fitstack.workout_tracker.models.Muscle;
import com.fitstack.workout_tracker.models.Routine;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoutineServiceTest {

    @InjectMocks
    RoutineService service;

    @Mock
    RoutineRepository repository;

    @Test
    void shouldAdd(){
        Routine input = new Routine();
        input.setRoutineId(0);
        input.setUserId(1);
        input.setTitle("Glute Routine");
        input.setMuscles(List.of(Muscle.GLUTEAL));

        Routine expected = new Routine();
        expected.setRoutineId(10);
        expected.setUserId(1);
        expected.setTitle("Glute Routine");
        expected.setMuscles(List.of(Muscle.GLUTEAL));

        when(repository.add(input)).thenReturn(expected);

        Result<Routine> result = service.addRoutine(input);

        assertTrue(result.isSuccess());
        assertEquals(ResultType.SUCCESS, result.getType());
        assertNotNull(result.getPayload());
        assertEquals(10, result.getPayload().getRoutineId());
    }

    @Test
    void shouldNotAddNull(){
        Routine input = null;

        Result<Routine> result = service.addRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("routine cannot be null"));
    }

    @Test
    void shouldNotAddMissingTitle() {
        Routine input = new Routine();
        input.setUserId(1);
        input.setMuscles(List.of(Muscle.BICEPS));

        Result<Routine> result = service.addRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("routine title is required"));
    }

    @Test
    void shouldNotAddMissingUserId(){
        Routine input = new Routine();
        input.setTitle("Biceps workout");
        input.setMuscles(List.of(Muscle.BICEPS));

        Result<Routine> result = service.addRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("User id is required for a routine"));
    }

    @Test
    void shouldNotAddMissingMuscles(){
        Routine input = new Routine();
        input.setTitle("Biceps workout");
        input.setUserId(1);

        Result<Routine> result = service.addRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("At least one muscle is required for a routine"));
    }

    @Test
    void shouldNotAddWithRoutineId(){
        Routine input = new Routine();
        input.setTitle("Biceps workout");
        input.setUserId(1);
        input.setMuscles(List.of(Muscle.BICEPS));
        input.setRoutineId(1);

        Result<Routine> result = service.addRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("routine id cannot be set for `add` operation"));
    }

    @Test
    void shouldUpdate(){
        Routine input = new Routine();
        input.setRoutineId(1);
        input.setUserId(1);
        input.setTitle("Glute Routine");
        input.setMuscles(List.of(Muscle.GLUTEAL));

        when(repository.update(input)).thenReturn(true);

        Result<Routine> result = service.updateRoutine(input);

        assertTrue(result.isSuccess());
        assertEquals(ResultType.SUCCESS, result.getType());
    }

    @Test
    void shouldNotUpdateNull(){
        Routine input = null;

        Result<Routine> result = service.updateRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("routine cannot be null"));
    }

    @Test
    void shouldNotUpdateMissingTitle(){
        Routine input = new Routine();
        input.setRoutineId(1);
        input.setUserId(1);
        input.setMuscles(List.of(Muscle.BICEPS));

        Result<Routine> result = service.updateRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("routine title is required"));
    }

    @Test
    void shouldNotUpdateMissingUserId(){
        Routine input = new Routine();
        input.setRoutineId(1);
        input.setTitle("Bi Day");
        input.setMuscles(List.of(Muscle.BICEPS));

        Result<Routine> result = service.updateRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("User id is required for a routine"));
    }

    @Test
    void shouldNotUpdateMissingMuscles(){
        Routine input = new Routine();
        input.setRoutineId(1);
        input.setTitle("Biceps workout");
        input.setUserId(1);

        Result<Routine> result = service.updateRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("At least one muscle is required for a routine"));
    }

    @Test
    void shouldNotUpdateMissingRoutineId(){
        Routine input = new Routine();
        input.setTitle("Biceps workout");
        input.setUserId(1);
        input.setMuscles(List.of(Muscle.BICEPS));

        Result<Routine> result = service.updateRoutine(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("routine id is required for `update` operation"));
    }

}