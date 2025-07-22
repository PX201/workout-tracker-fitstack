package com.fitstack.workout_tracker.data.mappers;

import com.fitstack.workout_tracker.models.Routine;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RoutineMapper implements RowMapper<Routine> {
    @Override
    public Routine mapRow(ResultSet resultSet, int i) throws SQLException {
        Routine routine = new Routine();
        routine.setRoutineId(resultSet.getLong("routine_id"));
        routine.setUserId(resultSet.getLong("user_id"));
        routine.setTitle(resultSet.getString("title"));
        return routine;
    }
}
