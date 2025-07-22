package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.dto.RegisterRequest;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;


import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserService userService;

    @Test
    void register_shouldRegister() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("sam@email.com");
        request.setUsername("Sam");
        request.setPassword("hash1234");

        User expected = makeUser();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);
        when(userRepository.addUser(any(User.class))).thenReturn(expected);

        var actual = userService.register(request);

        assertEquals(expected, actual);
    }

    @Test
    void register_shouldThrowException_whenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("sam@email.com");
        request.setUsername("Sam");
        request.setPassword("hash1234");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(makeUser());

        assertThrows(DuplicateKeyException.class, () -> {
            userService.register(request);
        });
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