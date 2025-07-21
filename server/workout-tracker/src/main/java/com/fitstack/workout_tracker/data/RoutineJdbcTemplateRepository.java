package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.data.mappers.RoutineMapper;
import com.fitstack.workout_tracker.models.Routine;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class RoutineJdbcTemplateRepository implements RoutineRepository {

    private final JdbcTemplate jdbcTemplate;

    public RoutineJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Routine> findAll() {
        final String sql = "select routine_id, user_id, title from routine;";
        return jdbcTemplate.query(sql, new RoutineMapper());
    }

    @Override
    public Routine add(Routine routine) {
        final String sql = "insert into routine (user_id, title) values (?,?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, routine.getUserId());
            ps.setString(2, routine.getTitle());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        routine.setRoutineId(keyHolder.getKey().intValue());
        return routine;
    }

    @Override
    public boolean update(Routine routine) {
        final String sql = "update routine set user_id = ?, title = ? where routine_id = ?;";

        return jdbcTemplate.update(sql,
                routine.getUserId(),
                routine.getTitle(),
                routine.getRoutineId()) > 0;
    }

    @Override
    @Transactional
    public boolean deleteById(int routineId) {
        jdbcTemplate.update("delete from routine_muscle where routine_id = ?;", routineId);
        jdbcTemplate.update("delete from log where routine_id = ?;", routineId);
        return jdbcTemplate.update("delete from routine where routine_id = ?;", routineId) > 0;
    }
}
