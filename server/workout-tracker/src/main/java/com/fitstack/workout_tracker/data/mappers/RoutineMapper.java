package com.fitstack.workout_tracker.data.mappers;

import com.fitstack.workout_tracker.models.Routine;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RoutineMapper implements RowMapper<Routine> {
    @Override
    public Routine mapRow(ResultSet resultSet, int i) throws SQLException {
        Routine routine = new Routine();
        routine.setRoutineId(resultSet.getInt("routine_id"));
        routine.setTitle(resultSet.getString("title"));
        routine.setUserId(resultSet.getInt("user_id"));
        return routine;
    }
}
