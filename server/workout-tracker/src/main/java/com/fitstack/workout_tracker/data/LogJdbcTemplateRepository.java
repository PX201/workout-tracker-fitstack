package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.data.mappers.LogMapper;
import com.fitstack.workout_tracker.models.Log;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class LogJdbcTemplateRepository implements LogRepository{

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<Log> findAll() {
        final String sql = "select log_id, routine_id, title, date, duration, intensity, notes from log join routine using (routine_id);";
        return jdbcTemplate.query(sql, new LogMapper());
    }

    @Override
    public List<Log> findByUserId(long userId) {
        final String sql = "select log_id, routine_id, title, date, duration, intensity, notes from log join routine using (routine_id) where user_id = ?;";
        return jdbcTemplate.query(sql, new LogMapper(), userId);
    }

    @Override
    public List<Log> findByRoutineId(long routineId) {
        final String sql = "select log_id, routine_id, title, date, duration, intensity, notes from log join routine using (routine_id) where routine_id = ?;";
        return jdbcTemplate.query(sql, new LogMapper(), routineId);
    }

    @Override
    public Log findById(long logId) {
        final String sql = "select log_id, routine_id, title, date, duration, intensity, notes from log join routine using (routine_id) where log_id = ?;";
        try {
            return jdbcTemplate.queryForObject(sql, new LogMapper(), logId);
        } catch (DataAccessException ex) {
            return null;
        }
    }

    @Override
    public Log add(Log log) {
        final String sql = "insert into log (routine_id, date, duration, intensity, notes) VALUES (?, ?, ?, ?, ?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
            int rowsAffected = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, log.getRoutineId());
                ps.setDate(2, Date.valueOf(log.getDate()));
                ps.setInt(3, log.getDuration());
                ps.setInt(4, log.getIntensity());
                ps.setString(5, log.getNotes());
                return ps;
            }, keyHolder);

            if (rowsAffected <= 0) {
                return null;
            }

            Long id = keyHolder.getKey() != null ? keyHolder.getKey().longValue() : null;
            if (id == null) {
                return null;
            }
            log.setLogId(id);
            return log;
        } catch (DataAccessException ex) {
            return null;
        }
    }



    @Override
    public boolean update(Log log) {
        final String sql = "update log set routine_id = ?, date = ?, duration = ?, intensity = ?, notes = ? where log_id = ?;";

        int rowsAffected = jdbcTemplate.update(sql,
                log.getRoutineId(),
                Date.valueOf(log.getDate()),
                log.getDuration(),
                log.getIntensity(),
                log.getNotes(),
                log.getLogId()
        );

        return rowsAffected > 0;
    }

    @Override
    public boolean deleteById(long logId) {
        final String sql = "delete from log where log_id = ?;";
        return jdbcTemplate.update(sql, logId) > 0;
    }

}
