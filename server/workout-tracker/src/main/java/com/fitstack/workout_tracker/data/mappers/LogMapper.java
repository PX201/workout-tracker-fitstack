package com.fitstack.workout_tracker.data.mappers;

import com.fitstack.workout_tracker.models.Log;
import com.fitstack.workout_tracker.models.Routine;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class LogMapper implements RowMapper<Log> {
    @Override
    public Log mapRow(ResultSet resultSet, int i) throws SQLException {
        Log log = new Log();
        log.setLogId(resultSet.getLong("log_id"));
        log.setRoutineId(resultSet.getLong("routine_id"));
        log.setRoutineTitle(resultSet.getString("title"));
        log.setDate(resultSet.getDate("date").toLocalDate());
        log.setDuration(resultSet.getInt("duration"));
        log.setIntensity(resultSet.getInt("intensity"));
        log.setNotes(resultSet.getString("notes"));
        return log;
    }
}
