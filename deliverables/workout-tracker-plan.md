
# Workout Tracker Plan

**Team Name: FitStack**

---

## Problem Statement

### Context  
Many people want to stay consistent with fitness but struggle with motivation, tracking, and maintaining a routine. Existing apps are often too complex, requiring detailed input that discourages casual users.

### Core Problem  
There is no lightweight, visual-focused app to track workout consistency, muscle group balance, and routine adherence.

### Impact on Users  
Without an intuitive interface, users may overtrain some muscle groups, neglect others, or lose motivation due to lack of feedback.

### Opportunity for Solution  
A simplified app that focuses on consistency, balance, and visual feedback (e.g. heatmaps, charts) will support long-term fitness habits.

---

## Core Features and Scope

- Register/login with role-based access (User/Admin)
- Create and manage workout routines
- Log workouts using routines
- View visual feedback (dot calendar, heatmap, stats)
- Admin can manage users and routines

---

## Technical Solution

### Overview  
We will build a full-stack CRUD web application using Java Spring Boot (backend) and React (frontend), with visual tracking and admin features.

### Features

- Role-based authentication (JWT)
- Routine management (CRUD)
- Workout logging with optional notes
- Dot calendar for consistency tracking
- Muscle group heatmap (`react-body-highlighter`)
- Admin dashboard for user/routine control

---

## User Scenarios

- **User A** uses a "Push Day" routine and tracks consistency using the calendar and heatmap.  
- **User B** notices gaps in leg training from the heatmap and adjusts accordingly.  
- **Admin** disables a spam account and removes inappropriate routines.

---

## User Stories

### Manage Routines  
- **Goal**: Users can create, edit, and delete personal routines.  
- **Plan**: Managed via dashboard  
- **Post-condition**: Routine saved, updated, or removed

### Log and Manage Workouts  
- **Goal**: Users can track workouts and manage their logs  
- **Plan**: Select routine, enter duration/intensity/notes  
- **Post-condition**: Logs saved, updated, or deleted

### Visualize Progress  
- **Goal**: Users want feedback on consistency and muscle use  
- **Plan**: Dot calendar and heatmap update with logs  
- **Post-condition**: Visuals reflect current activity

### Admin: User Management  
- **Goal**: Admins manage user accounts  
- **Plan**: Admin dashboard provides controls  
- **Post-condition**: Accounts deactivated, reactivated, or deleted

### Admin: Routine Oversight  
- **Goal**: Admins remove routines if needed  
- **Plan**: Admins can view and delete any routine  
- **Post-condition**: Routine is removed

---

## Glossary

- **Routine**: A saved workout plan with selected muscle groups  
- **Log**: A workout entry with date, duration, intensity, and optional notes  
- **Muscle Group**: Targeted body regions (e.g. Pecs, Quads)  
- **Muscle Heatmap**: Visual indicator of recent muscle group usage  
- **User**: Can create routines, log workouts, and view stats  
- **Admin**: Can manage users and view/delete all routines

---

## Learning Goal

**Learning Goal:** We want to learn how to integrate `react-body-highlighter` into a React application.

**Application:** Used to create a muscle group heatmap based on user workout logs.

**Research and Resources:** Official documentation, GitHub examples, and mock data testing.

**Challenges:** Mapping muscle group data to diagram regions and updating highlights dynamically.

**Success Criteria:** If users see a body diagram with muscle groups highlighted based on recent activity, this goal is achieved.

---

## High-Level Requirements

- **Database:** 5 normalized MySQL tables  
  - `user`, `routine`, `log`, `muscle_group`, `routine_muscle` (bridge table)
- **Backend:** Spring Boot, MVC, JDBC, Spring Security, JUnit
- **Frontend:** React, Bootstrap, Chart.js, `react-body-highlighter`
- **Testing:** JUnit tests for services and repositories
- **Security:** Role-based access (User/Admin) via JWT
- **Architecture:** Three-layer structure (Controller → Service → Repository)

---

## Data Models & Validation

### User
- `userId`, `username`, `email`, `password`, `role`, `dateJoined`, `isActive`  
- Validations: required fields, valid email, role = 'USER' or 'ADMIN'

### Routine
- `routineId`, `title`, `muscleGroups`  
- Validations: title 3–100 chars, at least one muscle group

### Log
- `logId`, `userId`, `routineId`, `date`, `duration`, `intensity`, `notes`  
- Validations: valid IDs, duration > 0, intensity 1–10

### MuscleGroup
- `muscleGroupId`, `muscleGroupName`

---

## Package/Class Overview

```
src
├───main
│   └───java
│       └───learn
│           └───workout_tracker
│               │   WorkoutTrackerApp.java
│               ├───config
│               │   └───security
│               │       JwtConverter.java
│               │       SecurityConfig.java
│               │       JwtRequestFilter.java
│               ├───data
│               │       RoutineRepository.java
│               │       RoutineJdbcTemplateRepository.java
│               │       LogRepository.java
│               │       LogJdbcTemplateRepository.java
│               │       UserRepository.java
│               │       UserJdbcRepository.java
│               │       DataException.java
│               ├───domain
│               │       UserService.java
│               │       RoutineService.java
│               │       LogService.java
│               ├───models
│               │       User.java
│               │       Routine.java
│               │       Log.java
│               │       MuscleGroup.java
│               └───controller
│                       UserController.java
│                       RoutineController.java
│                       LogController.java
│                       AuthController.java
└───test
    └───java
        └───learn
            └───workout_tracker
                ├───data
                │       RoutineJdbcTemplateRepositoryTest.java
                │       LogJdbcTemplateRepositoryTest.java
                │       UserJdbcRepositoryTest.java
                └───domain
                        UserServiceTest.java
                        RoutineServiceTest.java
                        LogServiceTest.java
```

---

## Steps

1. Set up Maven project and dependencies  
2. Create models and define validation rules  
3. Build MySQL schema and seed data  
4. Implement JDBC repositories  
5. Add business logic in services  
6. Build REST controllers  
7. Secure routes with Spring Security + JWT  
8. Develop React frontend with UI components  
9. Integrate calendar and heatmap
10. Write and run JUnit tests  
11. Dockerize backend and frontend  
12. Perform user testing  
13. Deliver final demo
