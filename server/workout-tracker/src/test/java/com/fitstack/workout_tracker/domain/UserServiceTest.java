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

    @Mock
    JwtService jwtService;

    @InjectMocks
    UserService userService;



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

        Result<User> actual = userService.register(request);

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

        Result<User> result = userService.register(request);

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

        Result<User> result = userService.register(request);

        assertFalse(result.isSuccess());
        System.out.println(result.getMessages());

        assertTrue(result.getMessages().contains("Username already exists"));
    }

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

    @Test
    void login_shouldSucceed() {
        User user = makeUser();
        AuthRequest request = new AuthRequest();
        request.setEmail("sam@email.com");
        request.setPassword( "hash1234");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(user);
        when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("fake-jwt-token");

        Result<JwtResponse> result = userService.login(request);

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

        Result<JwtResponse> result1 = userService.login(request);
        assertFalse(result1.isSuccess());
        assertEquals(ResultType.NOT_FOUND, result1.getType());

        // case: inactive
        User inactiveUser = makeUser();
        inactiveUser.setActive(false);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(inactiveUser);

        Result<JwtResponse> result2 = userService.login(request);
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

        Result<JwtResponse> result = userService.login(request);

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