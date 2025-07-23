package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.dto.*;
import com.fitstack.workout_tracker.security.JwtService;
import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.exception.UserNotFoundException;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;


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
        user.setPassword(passwordEncoder.encode(request.getPassword())); // done
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
            result.addErrorMessage("Email already in use");
        }

        if(!existingUser.getUsername().equalsIgnoreCase(userReq.getUsername()) &&
                userRepository.findAll().stream().anyMatch(u ->
                        u.getUsername().equalsIgnoreCase(userReq.getUsername()))){
            result.addErrorMessage("Username already in use");
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

    public boolean deleteByUserId(long userId) {
        return userRepository.deleteByUserId(userId);
    }


    public Result<Void> changePassword(User user, PasswordChangeRequest request){
        Result<Void> result = new Result<>();
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
            result.addErrorMessage("Wrong current password");
            return result;
        }
        // set the new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        boolean updated = userRepository.updateUser(user);

        if(!updated){
            result.addErrorMessage("Something went wrong!");
        }

        return result;
    }


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


    public Result<JwtResponse> login(AuthRequest request) {
        Result<JwtResponse> result = new Result<>();

        User user = userRepository.findByEmail(request.getEmail());
        if (user == null || !user.isActive()) {
            result.addMessage("Invalid email or account inactive.", ResultType.NOT_FOUND);
            return result;
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            result.addMessage("Invalid password.", ResultType.INVALID);
            return result;
        }

        String token = jwtService.generateToken(user);
        result.setPayload(new JwtResponse(token, user));
        return result;
    }


}
