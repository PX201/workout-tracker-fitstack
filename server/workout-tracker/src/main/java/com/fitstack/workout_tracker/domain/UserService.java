package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.dto.UserUpdateRequest;
import com.fitstack.workout_tracker.exception.UserNotFoundException;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public List<User> findAll() {
        return userRepository.findAll().stream().filter(u -> u.hasRole(Role.USER)).toList(); // display only users with 'USER' role
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

    public Result<User> updateBasicInfo(UserUpdateRequest userReq) {
        // Validation
        Result<User> result = new Result<>();
        User existingUser = userRepository.findByUserId(userReq.getUserId());

        if(existingUser == null){
            result.addErrorMessage("User Not Found");
            return result;
        }

        if(!existingUser.getEmail().equalsIgnoreCase(userReq.getEmail()) && userRepository.findByEmail(userReq.getEmail()) != null){
            result.addErrorMessage("Email already in use.");
        }

        if(!existingUser.getUsername().equalsIgnoreCase(userReq.getUsername()) &&
                userRepository.findAll().stream().anyMatch(u ->
                        u.getUsername().equalsIgnoreCase(userReq.getUsername()))){
            result.addErrorMessage("Username already in use.");
        }

        // Update user info

        existingUser.setUsername(userReq.getUsername());
        existingUser.setEmail(userReq.getEmail());

        boolean updated = userRepository.updateUser(existingUser);

        if (!updated) {
            result.addErrorMessage("Update failed");
            return result;
        }

        result.setPayload(existingUser);
        return result;
    }

    public boolean delete(long userId) {
        return userRepository.deleteByUserId(userId);
    }

    // for later: implement change password
    public boolean changePassword(User user, String newPassword){
        return false;
    }

    // for later: implement reactivate/deactivate user
    public boolean setActiveStatus(long userId, boolean isActive){
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return false;
        }
        user.setActive(isActive);
        return userRepository.updateUser(user);
    }

    // update the user role
    public boolean updateRole(long userId, Role role) throws UserNotFoundException {
        User existingUser = userRepository.findByUserId(userId);
        if(existingUser == null) throw new UserNotFoundException("User not found with id: " + userId);

        existingUser.setRole(role);
        return userRepository.updateUser(existingUser);
    }


}
