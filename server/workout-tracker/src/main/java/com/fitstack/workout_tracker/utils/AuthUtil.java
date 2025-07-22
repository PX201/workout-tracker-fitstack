package com.fitstack.workout_tracker.utils;

import com.fitstack.workout_tracker.models.User;
import org.springframework.security.core.Authentication;

public class AuthUtil {

    public static User getUser(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    public static Long getUserId(Authentication auth) {
        User user = getUser(auth);
        return (user != null) ? user.getUserId() : null;
    }

    public static String getEmail(Authentication auth) {
        User user = getUser(auth);
        return (user != null) ? user.getEmail() : null;
    }
}
