package com.fitstack.workout_tracker.security;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.ResultType;
import com.fitstack.workout_tracker.dto.AuthRequest;
import com.fitstack.workout_tracker.dto.JwtResponse;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

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



}
