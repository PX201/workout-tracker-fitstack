package com.fitstack.workout_tracker.data;

import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserJdbcTemplateRepositoryTest {

    @Autowired
    UserRepository repository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void resetKnownGoodState() {
        jdbcTemplate.execute("CALL set_known_good_state();");
    }

    @Test
    void findAll_shouldReturnThreeUsers() {
        List<User> users = repository.findAll();
        assertEquals(3, users.size());
        System.out.println(users.get(0));
    }

    @Test
    void findByUserId_shouldReturnCorrectUser() {
        User user = repository.findByUserId(1);
        assertNotNull(user);
        assertEquals("dougwhite", user.getUsername());
        assertEquals("whitedoug21@gmail.com", user.getEmail());
    }

    @Test
    void findByUserId_shouldReturnNullForInvalidId() {
        User user = repository.findByUserId(999);
        assertNull(user);
    }

    @Test
    void findByEmail_shouldReturnCorrectUser() {
        User user = repository.findByEmail("aiman@gmail.com");
        assertNotNull(user);
        assertEquals(2, user.getUserId());
        assertEquals("aiman", user.getUsername());
    }

    @Test
    void findByEmail_shouldReturnNullForNonexistentEmail() {
        User user = repository.findByEmail("doesnotexist@example.com");
        assertNull(user);
    }

    @Test
    void addUser_shouldInsertNewUserAndReturnItWithId() {
        User newUser = new User();
        newUser.setUsername("test");
        newUser.setEmail("test@gmail.com");
        newUser.setPassword("hashed123");
        newUser.setRole(Role.USER);
        newUser.setActive(true);
        newUser.setDateJoined(LocalDate.now());

        User actual = repository.addUser(newUser);

        assertNotNull(actual);
        assertTrue(actual.getUserId() > 0);
        assertEquals("test", actual.getUsername());
    }

    @Test
    void updateUser_shouldModifyUserDetails() {
        User user = repository.findByUserId(1);
        user.setUsername("updatedName");
        user.setEmail("updated@email.com");

        boolean result = repository.updateUser(user);
        assertTrue(result);

        User updated = repository.findByUserId(1);
        assertEquals("updatedName", updated.getUsername());
        assertEquals("updated@email.com", updated.getEmail());
    }

    @Test
    void updateUser_shouldFailForInvalidId() {
        User user = new User();
        user.setUserId(999);
        user.setUsername("none");
        user.setEmail("none@email.com");
        user.setPassword("none");
        user.setRole(Role.USER);
        user.setActive(true);
        user.setDateJoined(LocalDate.now());

        boolean result = repository.updateUser(user);
        assertFalse(result);
    }

    @Test
    void deleteByUserId_shouldRemoveUser() {
        boolean deleted = repository.deleteByUserId(3);
        assertTrue(deleted);

        User user = repository.findByUserId(3);
        assertNull(user);
    }

    @Test
    void deleteByUserId_shouldFailForInvalidId() {
        boolean deleted = repository.deleteByUserId(999);
        assertFalse(deleted);
    }


}

