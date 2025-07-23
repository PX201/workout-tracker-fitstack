package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.dto.*;
import com.fitstack.workout_tracker.exception.UserNotFoundException;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import com.fitstack.workout_tracker.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;


    @Test
    void updateBasicInfo_shouldUpdateSuccessfully() {
        User existing = makeUser();
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setUsername("updated_username");
        updateRequest.setEmail("updated_email@example.com");

        when(userRepository.findAll()).thenReturn(List.of());
        when(userRepository.updateUser(any(User.class))).thenReturn(true);

        Result<User> result = userService.updateBasicInfo(updateRequest, existing);
        assertTrue(result.isSuccess());
        assertEquals("updated_email@example.com", result.getPayload().getEmail());
    }

    @Test
    void updateBasicInfo_shouldReturnNotFoundWhenUserNotFound() {
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setUsername("notExist");
        updateRequest.setEmail("none@email.com");

        Result<User> result = userService.updateBasicInfo( updateRequest, null);
        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().contains("User Not Found"));
    }

    @Test
    void setActiveStatus_shouldUpdateStatus() {
        User user = makeUser();
        when(userRepository.findByUserId(user.getUserId())).thenReturn(user);
        when(userRepository.updateUser(user)).thenReturn(true);

        boolean changed = userService.setActiveStatus(user.getUserId(), false);
        assertTrue(changed);
    }

    @Test
    void updateRole_shouldUpdateRole() throws UserNotFoundException {
        User user = makeUser();
        when(userRepository.findByUserId(user.getUserId())).thenReturn(user);
        when(userRepository.updateUser(user)).thenReturn(true);

        boolean updated = userService.updateRole(user.getUserId(), Role.ADMIN);
        assertTrue(updated);
        assertEquals(Role.ADMIN, user.getRole());
    }

    @Test
    void updateRole_shouldThrowIfUserNotFound() {
        when(userRepository.findByUserId(999)).thenReturn(null);
        assertThrows(UserNotFoundException.class, () -> userService.updateRole(999, Role.ADMIN));
    }

    @Test
    void changePassword_shouldSucceed() {
        User user = makeUser();
        PasswordChangeRequest request = new PasswordChangeRequest("oldpassword", "newpassword");

        when(passwordEncoder.matches("oldpassword", user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newpassword")).thenReturn("newpassword");
        when(userRepository.updateUser(user)).thenReturn(true);

        Result<Void> result = userService.changePassword(user, request);

        assertTrue(result.isSuccess());
    }

    @Test
    void changePassword_shouldFailOnWrongPassword() {
        User user = makeUser();
        PasswordChangeRequest request = new PasswordChangeRequest("wrongpassword", "newpassword");


        when(passwordEncoder.matches("wrongpassword", user.getPassword())).thenReturn(false);

        Result<Void> result = userService.changePassword(user, request);

        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().contains("Wrong current password"));
    }


    @Test
    void changePassword_shouldFailWhenUpdateFails() {
        User user = makeUser();
        PasswordChangeRequest request = new PasswordChangeRequest("oldpassword", "newpassword");

        when(passwordEncoder.matches("oldpassword", user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newpassword")).thenReturn("newpassword");
        when(userRepository.updateUser(user)).thenReturn(false);

        Result<Void> result = userService.changePassword(user, request);

        assertFalse(result.isSuccess());
        assertTrue(result.getMessages().contains("Something went wrong!"));
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