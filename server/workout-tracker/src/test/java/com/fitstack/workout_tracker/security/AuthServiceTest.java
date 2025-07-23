package com.fitstack.workout_tracker.security;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.domain.Result;
import com.fitstack.workout_tracker.domain.ResultType;
import com.fitstack.workout_tracker.dto.AuthRequest;
import com.fitstack.workout_tracker.dto.JwtResponse;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
@SpringBootTest

class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtService jwtService;

    @InjectMocks
    AuthService authService;

    @Test
    void register_shouldRegister() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("sam@email.com");
        request.setUsername("Sam");
        request.setPassword("hash1234");

        User expected = makeUser();

        when(passwordEncoder.encode(request.getPassword())).thenReturn("hash1234");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);
        when(userRepository.findAll()).thenReturn(List.of());
        when(userRepository.addUser(any(User.class))).thenReturn(expected);

        Result<User> actual = authService.register(request);

        assertTrue(actual.isSuccess());
        assertNotNull(actual.getPayload());
        assertEquals(expected.getEmail(), actual.getPayload().getEmail());
    }

    @Test
    void register_shouldFail_whenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("sam@email.com");
        request.setUsername("Sam");
        request.setPassword("hash1234");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(makeUser());

        Result<User> result = authService.register(request);

        assertFalse(result.isSuccess());

        assertTrue(result.getMessages().contains("Email already exists"));
    }

    @Test
    void register_shouldFail_whenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@email.com");
        request.setUsername("Sam");
        request.setPassword("hash1234");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);
        when(userRepository.findAll()).thenReturn(List.of(makeUser()));

        Result<User> result = authService.register(request);

        assertFalse(result.isSuccess());
        System.out.println(result.getMessages());

        assertTrue(result.getMessages().contains("Username already exists"));
    }

    @Test
    void login_shouldSucceed() {
        User user = makeUser();
        AuthRequest request = new AuthRequest();
        request.setEmail("sam@email.com");
        request.setPassword( "hash1234");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(user);
        when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("fake-jwt-token");

        Result<JwtResponse> result = authService.login(request);

        assertTrue(result.isSuccess());
        assertEquals("fake-jwt-token", result.getPayload().getToken());
        assertEquals(user, result.getPayload().getUser());
    }

    @Test
    void login_shouldFailIfUserNotFoundOrInactive() {
        AuthRequest request = new AuthRequest();
        request.setEmail("wrong@email.com");
        request.setPassword( "password");

        // case: not found
        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);

        Result<JwtResponse> result1 = authService.login(request);
        assertFalse(result1.isSuccess());
        assertEquals(ResultType.NOT_FOUND, result1.getType());

        // case: inactive
        User inactiveUser = makeUser();
        inactiveUser.setActive(false);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(inactiveUser);

        Result<JwtResponse> result2 = authService.login(request);
        assertFalse(result2.isSuccess());
        assertEquals(ResultType.NOT_FOUND, result2.getType());
    }

    @Test
    void login_shouldFailIfPasswordInvalid() {
        User user = makeUser();
        AuthRequest request = new AuthRequest();

        request.setEmail(user.getEmail());
        request.setPassword( "wrongpassword");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(user);
        when(passwordEncoder.matches("wrongpassword", user.getPassword())).thenReturn(false);

        Result<JwtResponse> result = authService.login(request);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().contains("Invalid password."));
    }


    private User makeUser(){
        User user = new User();
        user.setUserId(1);
        user.setUsername("Sam");
        user.setEmail("sam@email.com");
        user.setPassword("hash1234");
        user.setRole(Role.USER);
        user.setActive(true);
        user.setDateJoined(LocalDate.now());
        return user;
    }

}