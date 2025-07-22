package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.models.User;

import java.util.List;

public interface UserRepository {

    List<User> findAll();

    User findByUserId(long userId);

    User findByEmail(String email);

    User addUser(User user);

    boolean deleteByUserId(long userId);

    boolean updateUser(User user);

}
