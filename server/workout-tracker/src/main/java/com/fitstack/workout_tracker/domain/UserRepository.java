package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.models.User;

import java.util.List;

public interface UserRepository {

    List<User> findAll();

    User findByUserId();

    User addUser(User user);

    boolean deleteByUserId();

    boolean updateUser(User user);

}
