package io.spring.enrollmentsystem.feature.section;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class MeetingDateValidator implements ConstraintValidator<MeetingDate, SectionDto> {

    private Integer minDays;
    private Integer maxDays;

    @Override
    public void initialize(MeetingDate parameters) {
        if (parameters.minDays() < 30 || parameters.minDays() > 60) {
            throw new IllegalArgumentException("Invalid minimum days for @MeetingDate. Must be in range (30,60)");
        }

        if (parameters.maxDays() < 105 || parameters.maxDays() > 120) {
            throw new IllegalArgumentException("Invalid maximum days for @MeetingDate. Must be in range (105,120)");
        }

        this.minDays = parameters.minDays();
        this.maxDays = parameters.maxDays();
    }

    @Override
    public boolean isValid(SectionDto sectionDto, ConstraintValidatorContext context) {
        if (sectionDto == null) {
            throw new IllegalArgumentException("@MeetingDate only applies to SectionRequest class.");
        }

        LocalDate dateStart = sectionDto.getDateStart();
        LocalDate dateEnd = sectionDto.getDateEnd();

        return dateStart.plusDays(minDays - 1).isBefore(dateEnd) &&
                dateStart.plusDays(maxDays + 1).isAfter(dateEnd);
    }
}
