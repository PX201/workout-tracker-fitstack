package com.fitstack.workout_tracker.domain;

import com.fitstack.workout_tracker.data.LogRepository;
import com.fitstack.workout_tracker.models.Log;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    public List<Log> findAll(){
        return logRepository.findAll();
    }

    public List<Log> findByUserId(long userId){
        return logRepository.findByUserId(userId);
    }

    public List<Log> findByRoutineId(long routineId){
        return logRepository.findByRoutineId(routineId);
    }

    public Log findByLogId(long logId){
        return logRepository.findById(logId);
    }

    public Result<Log> addLog(Log log){
        Result<Log> result = validate(log);
        if(!result.isSuccess()){
            return result;
        }
        if (log.getLogId() != 0) {
            result.addMessage("log id cannot be set for `add` operation", ResultType.INVALID);
            return result;
        }
        log = logRepository.add(log);
        result.setPayload(log);
        return result;
    }

    public Result<Log> updateLog(Log log){
        Result<Log> result = validate(log);
        if(!result.isSuccess()){
            return result;
        }
        if (log.getLogId() <= 0) {
            result.addMessage("log id is required for `update` operation", ResultType.INVALID);
            return result;
        }
        if (!logRepository.update(log)) {
            String msg = String.format("log ID: %s, not found", log.getLogId());
            result.addMessage(msg, ResultType.NOT_FOUND);
            return result;
        }
        return result;
    }

    public boolean deleteLog(long logId){
        return logRepository.deleteById(logId);
    }

    //HELPER
    private Result<Log> validate(Log log){
        Result<Log> result = new Result<>();
        if(log == null){
            result.addMessage("log cannot be null", ResultType.INVALID);
            return result;
        }
        if(log.getRoutineId() <= 0){
            result.addMessage("Routine is required for a Log", ResultType.INVALID);
            return result;
        }
        if (log.getRoutineTitle() != null && !log.getRoutineTitle().isBlank()) {
            result.addMessage("Log title should not be provided", ResultType.INVALID);
        }
        if(log.getDate() == null || log.getDate().isAfter(LocalDate.now())){
            result.addMessage("Log's date must be filled and not in the future", ResultType.INVALID);
            return result;
        }
        if(log.getDuration() <= 0){
            result.addMessage("Duration must be more than 0", ResultType.INVALID);
            return result;
        }
        if(log.getIntensity() < 1 || log.getIntensity() > 10){
            result.addMessage("Intensity must be 1-10", ResultType.INVALID);
            return result;
        }
        if(log.getNotes().length() > 280){
            result.addMessage("Notes is limited to 280 characters", ResultType.INVALID);
            return result;
        }
        return result;
    }
}
