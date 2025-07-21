package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.models.Muscle;
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

        for (Routine routine : routines) {
            assertNotNull(routine.getMuscles(), "MuscleGroups should not be null");
            assertFalse(routine.getMuscles().isEmpty(), "Each routine should have at least one muscle group");
        }
    }


// should find by id??
    @Test
    void shouldFindPushDay(){
        Routine result = repository.findById(1);
        assertTrue(result.getTitle().equals("Push day"));
        assertTrue(result.getUserId() == 1);
    }


    @Test
    void shouldAdd() {
        Routine r = new Routine();
        r.setTitle("Mountain climbing");
        r.setUserId(1);
        r.setMuscles(List.of(Muscle.UPPER_BACK, Muscle.GLUTEAL));

        Routine actual = repository.add(r);

        assertNotNull(actual);
        assertEquals(NEXT_ID, actual.getRoutineId());
        assertNotNull(actual.getMuscles());
        assertTrue(actual.getMuscles().contains(Muscle.UPPER_BACK));
        assertTrue(actual.getMuscles().contains(Muscle.GLUTEAL));
    }


    @Test
    void shouldUpdate() {
        Routine r = new Routine();
        r.setRoutineId(3);
        r.setUserId(2);
        r.setTitle("Mountain Skiing");
        r.setMuscles(List.of(Muscle.FOREARM, Muscle.ABS));

        assertTrue(repository.update(r));

        // Optional: Fetch and assert values changed as expected
        Routine updated = repository.findById(3);
        assertEquals("Mountain Skiing", updated.getTitle());
        assertEquals(2, updated.getUserId());
        assertNotNull(updated.getMuscles());
        assertTrue(updated.getMuscles().containsAll(List.of(Muscle.FOREARM, Muscle.ABS)));
    }


    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }
}