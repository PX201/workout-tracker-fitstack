package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.models.Routine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class RoutineJdbcTemplateRepositoryTest {
    final static int NEXT_ID = 7;

    @Autowired
    RoutineJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindAll() {
        List<Routine> routines = repository.findAll();
        assertNotNull(routines);

        assertTrue(routines.size() >= 5 && routines.size() <= 7);
    }

// should find by id??

    @Test
    void shouldAdd() {
        // all fields
        Routine r = new Routine();
        r.setTitle("Mountain climbing");
        r.setUserId(1);

        Routine actual = repository.add(r);
        assertNotNull(actual);
        assertEquals(NEXT_ID, actual.getRoutineId());
    }

    @Test
    void shouldUpdate() {
        Routine r = new Routine();
        r.setRoutineId(3);
        r.setUserId(2);
        r.setTitle("Mountain Skiing");
        assertTrue(repository.update(r));
    }

    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }
}