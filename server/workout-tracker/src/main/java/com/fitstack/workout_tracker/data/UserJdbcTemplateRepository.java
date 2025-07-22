package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.data.mappers.UserMapper;
import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserJdbcTemplateRepository implements UserRepository{

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<User> findAll() {
        final String sql = "select user_id, username, email, password, role, date_joined, is_active from `user`;";
        return jdbcTemplate.query(sql, new UserMapper());
    }

    @Override
    public User findByUserId(long userId) {
        final String sql = "select user_id, username, email, password, role, date_joined, is_active  " +
                "from `user` " +
                "where user_id = ?;";
        return jdbcTemplate.query(sql, new UserMapper(), userId).stream()
                .findFirst().orElse(null);
    }

    @Override
    public User findByEmail(String email) {
        final String sql = "select user_id, username, email, password, role, date_joined, is_active  " +
                "from `user` " +
                "where email = ?;";
        return jdbcTemplate.query(sql, new UserMapper(), email).stream()
                .findFirst().orElse(null);
    }

    @Override
    public User addUser(User user) {
        final String sql = "insert into `user` (username, email, password, role, date_joined, is_active) "
                + " values (?,?,?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getRole().toString());
            ps.setDate(5, Date.valueOf(LocalDate.now()));
            ps.setBoolean(6, user.isActive());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        user.setUserId(keyHolder.getKey().intValue());
        return user;
    }

    @Override
    public boolean deleteByUserId(long userId) {
        final String sql = "delete from `user` " +
                "where user_id = ?;";
        return jdbcTemplate.update(sql, userId) > 0;
    }

    @Override
    public boolean updateUser(User user) {
        final String sql = "update `user` set "
                + "username = ?, "
                + "email = ?, "
                + "password = ?, "
                + "role = ?, "
                + "date_joined = ?, "
                + "is_active = ? "
                + "where user_id = ?;";

        return jdbcTemplate.update(sql,
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().toString(),
                user.getDateJoined(),
                user.isActive(),
                user.getUserId()) > 0;
    }
}
