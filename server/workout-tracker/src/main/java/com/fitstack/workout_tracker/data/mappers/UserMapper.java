package com.fitstack.workout_tracker.data.mappers;

import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setUserId(rs.getLong("user_id"));
        user.setEmail(rs.getString("email"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setDateJoined(rs.getDate("date_joined").toLocalDate());
        user.setRole(Role.valueOf(rs.getString("role")));
        user.setActive(rs.getBoolean("is_active"));
        return user;
    }
}
