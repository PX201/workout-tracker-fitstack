package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.RoutineRepository;
import com.fitstack.workout_tracker.models.Routine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;

    public List<Routine> findAll(){
        return routineRepository.findAll();
    }

    public List<Routine> findByUserId(long userId){
        return routineRepository.findByUserId(userId);
    }

    public Routine findById(long routineId){
        return routineRepository.findById(routineId);
    }

    public Result<Routine> addRoutine(Routine routine){
        Result<Routine> result = validate(routine);

        if(!result.isSuccess()){
            return result;
        }

        if (routine.getRoutineId() != 0) {
            result.addMessage("routine id cannot be set for `add` operation", ResultType.INVALID);
            return result;
        }
        routine = routineRepository.add(routine);
        result.setPayload(routine);
        return result;
    }

    public Result<Routine> updateRoutine(Routine routine){
        Result<Routine> result = validate(routine);
        if(!result.isSuccess()){
            return result;
        }

        if (routine.getRoutineId() <= 0) {
            result.addMessage("routine id is required for `update` operation", ResultType.INVALID);
            return result;
        }
        if (!routineRepository.update(routine)) {
            String msg = String.format("routine ID: %s, not found", routine.getRoutineId());
            result.addMessage(msg, ResultType.NOT_FOUND);
            return result;
        }

        return result;
    }

    public boolean deleteRoutine(long routineId){
        return routineRepository.deleteById(routineId);
    }

    //HELPER
    private Result<Routine> validate(Routine routine){
        Result<Routine> result = new Result<>();
        if(routine == null){
            result.addMessage("routine cannot be null", ResultType.INVALID);
            return result;
        }
        if(routine.getTitle() == null || routine.getTitle().isBlank()){
            result.addMessage("routine title is required", ResultType.INVALID);
        }
        if(routine.getMuscles().isEmpty()){
            result.addMessage("At least one muscle is required for a routine", ResultType.INVALID);
        }
        if(routine.getUserId() == 0){
            result.addMessage("User id is required for a routine", ResultType.INVALID);
        }
        return result;
    }
}
