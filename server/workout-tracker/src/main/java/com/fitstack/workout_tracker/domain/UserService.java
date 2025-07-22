package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUserId(long userId) {
        return userRepository.findByUserId(userId);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new DuplicateKeyException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // need to be hashed later
        user.setDateJoined(LocalDate.now());
        user.setActive(true);
        user.setRole(Role.USER); // By default, we give any new user the role: `USER`

        return userRepository.addUser(user);
    }

    public boolean update(User user) {
        return userRepository.updateUser(user);
    }

    public boolean delete(long userId) {
        return userRepository.deleteByUserId(userId);
    }

    // for later: implement change password
    public boolean changePassword(User user, String newPassword){
        return false;
    }

    // for later: implement reactivate/deactivate user
    public boolean reactivate(long userId){
        return false;
    }
    public boolean activate(long userId){
        return false;
    }


}
