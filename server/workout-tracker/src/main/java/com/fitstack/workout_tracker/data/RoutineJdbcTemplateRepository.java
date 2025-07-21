package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.data.mappers.RoutineMapper;
import com.fitstack.workout_tracker.models.Muscle;
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
        List<Routine> routines = jdbcTemplate.query(sql, new RoutineMapper());

        for (Routine routine : routines) {
            routine.setMuscles(findMusclesForRoutine(routine.getRoutineId()));
        }

        return routines;
    }

    @Override
    public Routine findById(int routineId) {
        final String sql = "select routine_id, user_id, title from routine where routine_id = ?;";

        Routine routine = jdbcTemplate.query(sql, new RoutineMapper(), routineId).stream()
                .findFirst()
                .orElse(null);

        if (routine != null) {
            routine.setMuscles(getMusclesForRoutine(routineId));
        }

        return routine;
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

        for (Muscle muscle : routine.getMuscles()) {
            jdbcTemplate.update(
                    "INSERT INTO routine_muscle (routine_id, muscle_id) VALUES (?, ?)",
                    routine.getRoutineId(),
                    muscle.getId()
            );
        }

        return routine;
    }

    @Override
    @Transactional
    public boolean update(Routine routine) {
        final String sql = "update routine set user_id = ?, title = ? where routine_id = ?;";

        boolean updated = jdbcTemplate.update(sql,
                routine.getUserId(),
                routine.getTitle(),
                routine.getRoutineId()) > 0;

        if (updated) {
            updateRoutineMuscles(routine);
        }

        return updated;
    }


    @Override
    @Transactional
    public boolean deleteById(int routineId) {
        jdbcTemplate.update("delete from routine_muscle where routine_id = ?;", routineId);
        jdbcTemplate.update("delete from log where routine_id = ?;", routineId);
        return jdbcTemplate.update("delete from routine where routine_id = ?;", routineId) > 0;
    }

    // HELPER METHODS
    private List<Muscle> findMusclesForRoutine(int routineId) {
        final String sql = "select muscle_id from routine_muscle where routine_id = ?;";

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> Muscle.fromId(rs.getInt("muscle_id")),
                routineId
        );
    }

    private void updateRoutineMuscles(Routine routine) {
        // First delete old muscles
        final String deleteSql = "DELETE FROM routine_muscle WHERE routine_id = ?";
        jdbcTemplate.update(deleteSql, routine.getRoutineId());

        // Then insert new ones
        final String insertSql = "INSERT INTO routine_muscle (routine_id, muscle_id) VALUES (?, ?)";

        for (Muscle muscle : routine.getMuscles()) {
            jdbcTemplate.update(insertSql, routine.getRoutineId(), muscle.getId());
        }
    }

    private List<Muscle> getMusclesForRoutine(int routineId) {
        final String sql = "select m.muscle_id from muscle_group m inner join routine_muscle rm on m.muscle_id = rm.muscle_id where rm.routine_id = ?;";

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                Muscle.fromId(rs.getInt("muscle_id")), routineId);
    }

}
