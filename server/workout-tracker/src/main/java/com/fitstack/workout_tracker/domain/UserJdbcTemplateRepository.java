package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

@RequiredArgsConstructor
public class UserJdbcTemplateRepository implements UserRepository{

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    public User findByUserId() {
        return null;
    }

    @Override
    public User addUser(User user) {
        return null;
    }

    @Override
    public boolean deleteByUserId() {
        return false;
    }

    @Override
    public boolean updateUser(User user) {
        return false;
    }
}
