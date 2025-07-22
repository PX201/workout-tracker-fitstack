package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
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

    public Result<User> register(RegisterRequest request) {
        Result<User> result = new Result<>();

        if (userRepository.findByEmail(request.getEmail()) != null) {
            result.addErrorMessage("Email already exists");
        }

        if (userRepository.findAll().stream().anyMatch(u -> u.getUsername().equals(request.getUsername()))) {
            result.addErrorMessage("Username already exists");
        }

        if (!result.isSuccess()) {
            return result;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // hash later
        user.setDateJoined(LocalDate.now());
        user.setActive(true);
        user.setRole(Role.USER);

        user = userRepository.addUser(user);
        result.setPayload(user);
        return result;
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
