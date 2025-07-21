package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.domain.mappers.RoutineMapper;
import com.fitstack.workout_tracker.models.Routine;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class RoutineJdbcTemplateRepository implements RoutineRepository {

    private final JdbcTemplate jdbcTemplate;

    public RoutineJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Routine> findAll() {
        final String sql = "select * from routine;";
        return jdbcTemplate.query(sql, new RoutineMapper());
    }

    @Override
    public Routine add(Routine routine) {
        return null;
    }

    @Override
    public boolean update(Routine routine) {
        return false;
    }

    @Override
    public boolean deleteById(int routineId) {
        return false;
    }
}
