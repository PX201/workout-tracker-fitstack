drop database if exists workout_tracker_test;
-- Create the database
CREATE DATABASE IF NOT EXISTS workout_tracker_test;
USE workout_tracker_test;

DROP TABLE IF EXISTS routine_muscle;
DROP TABLE IF EXISTS log;
DROP TABLE IF EXISTS muscle_group;
DROP TABLE IF EXISTS routine;
DROP TABLE IF EXISTS `user`;

-- create tables and relationships
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

delimiter //
create procedure set_known_good_state()
begin

	delete from log;
    alter table log auto_increment = 1;
	delete from routine_muscle;
    alter table routine_muscle auto_increment = 1;
    delete from routine;
    alter table routine auto_increment = 1;
	delete from muscle_group;
    alter table muscle_group auto_increment = 1;
    delete from `user`;
	alter table `user` auto_increment = 1;

    INSERT INTO muscle_group (name) values ("biceps"), ("pectorals"), ("triceps"), ("glutes"), ("quadriceps");
insert into muscle_group (name) values ("lat");

insert into `user` (username, email, password, role, date_joined, is_active) values
("dougwhite", "whitedoug21@gmail.com", "passwordhashed", "ADMIN", "2020-06-30", true),
("aiman", "aiman@gmail.com", "passwordhashed", "ADMIN", "2020-08-12", true),
("simon", "simon@gmail.com", "passwordhashed", "ADMIN", "2020-11-02", true);

insert into routine (user_id, title) values (1, "Push day"),
(1, "Pull day"),
(2, "Leg day"),
(2, "Full Upper Body"),
(3, "Stretching"),
(3, "Biking");

insert into routine_muscle (routine_id, muscle_id) values (1, 2), (1, 3), (2, 1), (2, 6), (3,4), (3,5), (4,1), (4,2),(4,3),(4,6),(5,1),(5,3),(6,4),(6,5);

insert into log (routine_id, date, duration, intensity, notes) values
(1, "2025-07-15", 60, 8, "great day"),
(2, "2025-06-15", 45, 7, "ok day"),
(3, "2025-05-15", 40, 6, "good day");

end //
-- 4. Change the statement terminator back to the original.
delimiter ;
-- set SQL_SAFE_UPDATES = 1;
-- call set_known_good_state();