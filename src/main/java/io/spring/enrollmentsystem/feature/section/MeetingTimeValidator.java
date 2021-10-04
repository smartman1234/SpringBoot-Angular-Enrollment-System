package io.spring.enrollmentsystem.feature.section;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class MeetingTimeValidator implements ConstraintValidator<MeetingTime, SectionDto> {

    private Integer minMinutes;
    private LocalTime startAfter;
    private LocalTime startBefore;
    private LocalTime endAfter;
    private LocalTime endBefore;

    @Override
    public void initialize(MeetingTime parameters) {
        if (parameters.minMinutes() < 30 || parameters.minMinutes() > 60) {
            throw new IllegalArgumentException("Invalid minimum minutes for @MeetingTime. Must be in range (30,60)");
        }
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_TIME;
        this.minMinutes = parameters.minMinutes();
        this.startAfter = LocalTime.parse(parameters.startAfter(), formatter).minusSeconds(1);
        this.startBefore = LocalTime.parse(parameters.startBefore(), formatter).plusSeconds(1);
        this.endAfter = LocalTime.parse(parameters.endAfter(), formatter).minusSeconds(1);
        this.endBefore = LocalTime.parse(parameters.endBefore(), formatter).plusSeconds(1);
    }

    @Override
    public boolean isValid(SectionDto sectionDto, ConstraintValidatorContext context) {
        if (sectionDto == null) {
            throw new IllegalArgumentException("@MeetingTime only applies to SectionRequest class.");
        }

        LocalTime meetingTimeStart = sectionDto.getMeetingTimeStart();
        LocalTime meetingTimeEnd = sectionDto.getMeetingTimeEnd();

        if (meetingTimeStart == null || meetingTimeEnd == null) {
            return true;
        }

        return meetingTimeStart.isAfter(startAfter) && meetingTimeStart.isBefore(startBefore) &&
                meetingTimeEnd.isAfter(endAfter) && meetingTimeEnd.isBefore(endBefore) &&
                meetingTimeStart.plusMinutes(minMinutes - 1).plusSeconds(59).isBefore(meetingTimeEnd);
    }
}
