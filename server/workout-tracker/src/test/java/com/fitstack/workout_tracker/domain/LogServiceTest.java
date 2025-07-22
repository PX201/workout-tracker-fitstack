package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.LogRepository;
import com.fitstack.workout_tracker.models.Log;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)

class LogServiceTest {

    @InjectMocks
    LogService service;

    @Mock
    LogRepository repository;

    @Test
    void shouldAdd(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Log expected = new Log();
        expected.setLogId(1);
        expected.setRoutineId(1);
        expected.setDate(LocalDate.now());
        expected.setDuration(90);
        expected.setIntensity(7);
        expected.setNotes("Notes");

        when(repository.add(input)).thenReturn(expected);

        Result<Log> result = service.addLog(input);

        assertTrue(result.isSuccess());
        assertEquals(ResultType.SUCCESS, result.getType());
        assertNotNull(result.getPayload());
        assertEquals(1, result.getPayload().getLogId());
    }

    @Test
    void shouldNotAddNull(){
        Log input = null;

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("log cannot be null"));
    }

    @Test
    void shouldNotAddNoRoutineId(){
        Log input = new Log();
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Routine is required for a Log"));
    }

    @Test
    void shouldNotAddWithTitle(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setRoutineTitle("Title should not be here");
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Log title should not be provided"));
    }

    @Test
    void shouldNotAddNoDate(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Log's date must be filled and not in the future"));
    }

    @Test
    void shouldNotAddFutureDate(){
        Log input = new Log();
        input.setDate(LocalDate.of(2029, 10, 12));
        input.setRoutineId(1);
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Log's date must be filled and not in the future"));
    }

    @Test
    void shouldNotAddNoDuration(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Duration must be more than 0"));
    }

    @Test
    void shouldNotAddIntensityOutsideRange(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(11);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Intensity must be 1-10"));
    }

    @Test
    void shouldNotAddNotesTooLong(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("NotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Notes is limited to 280 characters"));
    }

    @Test
    void shouldNotAddWithLogId(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.addLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("log id cannot be set for `add` operation"));
    }

    @Test
    void shouldUpdate(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        when(repository.update(input)).thenReturn(true);

        Result<Log> result = service.updateLog(input);

        assertTrue(result.isSuccess());
        assertEquals(ResultType.SUCCESS, result.getType());
    }
    @Test
    void shouldNotUpdateNull(){
        Log input = null;

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("log cannot be null"));
    }

    @Test
    void shouldNotUpdateNoRoutineId(){
        Log input = new Log();
        input.setLogId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Routine is required for a Log"));
    }

    @Test
    void shouldNotUpdateWithTitle(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineTitle("Title is bad here");
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Log title should not be provided"));
    }

    @Test
    void shouldNotUpdateNoDate(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Log's date must be filled and not in the future"));
    }

    @Test
    void shouldNotUpdateFutureDate(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDate(LocalDate.of(2030, 10, 20));
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Log's date must be filled and not in the future"));
    }

    @Test
    void shouldNotUpdateNoDuration(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Duration must be more than 0"));
    }

    @Test
    void shouldNotUpdateIntensityOutsideRange(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(12);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Intensity must be 1-10"));
    }

    @Test
    void shouldNotUpdateNotesTooLong(){
        Log input = new Log();
        input.setLogId(1);
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("NotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotesNotes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Notes is limited to 280 characters"));
    }

    @Test
    void shouldNotUpdateWithoutLogId(){
        Log input = new Log();
        input.setRoutineId(1);
        input.setDate(LocalDate.now());
        input.setDuration(90);
        input.setIntensity(7);
        input.setNotes("Notes");

        Result<Log> result = service.updateLog(input);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("log id is required for `update` operation"));
    }

}