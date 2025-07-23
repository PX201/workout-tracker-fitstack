drop database if exists workout_tracker;
-- Create the database
CREATE DATABASE IF NOT EXISTS workout_tracker;
USE workout_tracker;
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS routine_muscle;
DROP TABLE IF EXISTS log;
DROP TABLE IF EXISTS muscle_group;
DROP TABLE IF EXISTS routine;
DROP TABLE IF EXISTS `user`;
-- 1. user table
CREATE TABLE `user` (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(1024) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
-- 2. muscle_group table
CREATE TABLE muscle_group (
    muscle_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
-- 3. routine table
CREATE TABLE routine (
    routine_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- 4. routine_muscle bridge table (with ID)
CREATE TABLE routine_muscle (
    bridge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    routine_id BIGINT NOT NULL,
    muscle_id INT NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routine(routine_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (muscle_id) REFERENCES muscle_group(muscle_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (routine_id, muscle_id)
);
-- 5. log table
CREATE TABLE log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    routine_id BIGINT,
    date DATE NOT NULL,
    duration INT, -- in minutes
    intensity INT CHECK (intensity BETWEEN 1 AND 10),
    notes TEXT,
    FOREIGN KEY (routine_id) REFERENCES routine(routine_id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Insert
INSERT INTO muscle_group (muscle_id, name) values
        (1, "trapezius"),
        (2, "upper-back"),
        (3, "lower-back"),
        (4, "chest"),
        (5, "biceps"),
        (6, "triceps"),
        (7, "forearm"),
        (8, "back-deltoids"),
        (9, "front-deltoids"),
        (10, "abs"),
        (11, "obliques"),
        (12, "adductor"),
        (13, "abductors"),
        (14, "hamstring"),
        (15, "quadriceps"),
        (16, "calves"),
        (17, "gluteal"),
        (18, "head"),
        (19, "neck"),
        (20, "knees"),
        (21, "left-soleus"),
        (22, "right-soleus"); 