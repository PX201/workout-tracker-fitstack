package com.fitstack.workout_tracker;

import com.fitstack.workout_tracker.data.UserRepository;
import com.fitstack.workout_tracker.models.Role;
import com.fitstack.workout_tracker.models.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DefaultAdminLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    DefaultAdminLoader(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;



    @Override
    public void run(String... args) throws Exception {
        if(userRepository.findByEmail(adminEmail) != null){
            System.out.println("Admin already exists. Skipping creation.");
        }else {
            User admin = new User();

            admin.setUsername("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setDateJoined(LocalDate.now());
            admin.setActive(true);

            userRepository.addUser(admin);
            System.out.println("Default admin account created.");
        }
    }
}
