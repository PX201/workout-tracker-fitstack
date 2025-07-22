package com.fitstack.workout_tracker.data;

import static org.junit.jupiter.api.Assertions.*;

import com.fitstack.workout_tracker.models.Log;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class LogJdbcTemplateRepositoryTest {
    final static int NEXT_ID = 4;

    @Autowired
    LogJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindAll() {
        List<Log> logs = repository.findAll();
        assertNotNull(logs);
        assertTrue(logs.size() >= 2 && logs.size() <= 4);
    }

    @Test
    void shouldFindByUserId(){
        List<Log> logs = repository.findByUserId(1);
        assertNotNull(logs);
        assertEquals(2, logs.size());
    }

    @Test
    void shouldNotFindFakeUserId(){
        List<Log> result = repository.findByUserId(999);
        assertEquals(0, result.size());
    }

    @Test
    void shouldFindByRoutineId(){
        List<Log> logs = repository.findByRoutineId(1);
        assertNotNull(logs);
        assertEquals(1, logs.size());
    }

    @Test
    void shouldNotFindFakeRoutineId(){
        List<Log> result = repository.findByRoutineId(999);
        assertEquals(0, result.size());
    }

    @Test
    void shouldAdd(){
        Log log = new Log();
        log.setRoutineId(6);
        log.setDate(LocalDate.now());
        log.setDuration(35);
        log.setIntensity(5);
        log.setNotes("Test add new log");

        Log result = repository.add(log);
        assertEquals(NEXT_ID, result.getLogId());
    }

    @Test
    void shouldNotAdd() {
        Log invalid = new Log();
        invalid.setRoutineId(999);
        invalid.setDate(LocalDate.now());
        invalid.setDuration(30);
        invalid.setIntensity(3);
        invalid.setNotes("This should fail");

        Log result = repository.add(invalid);
        assertNull(result);
    }


    @Test
    void shouldUpdate(){
        Log log = repository.findById(2);
        LocalDate xmas = LocalDate.of(2010, 12, 25);
        log.setDate(xmas);

        assertTrue(repository.update(log));

        Log result = repository.findById(2);
        assertEquals(xmas, result.getDate());
    }

    @Test
    void shouldNotUpdateNonExistingLogId(){
        Log log = repository.findById(1);
        log.setLogId(999);

        assertFalse(repository.update(log));
    }

    @Test
    void shouldDelete(){
        assertTrue(repository.deleteById(3));
        assertFalse(repository.deleteById(3));
    }

    @Test
    void shouldNotDeleteBadLogId(){
        assertFalse(repository.deleteById(999));
    }
}