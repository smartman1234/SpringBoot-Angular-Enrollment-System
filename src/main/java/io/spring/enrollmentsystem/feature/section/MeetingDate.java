package io.spring.enrollmentsystem.feature.section;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = MeetingDateValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MeetingDate {
    String message() default "DateEnd must be at least {minDays} days more than dateStart. " +
            "DateEnd must be at most {maxDays} days more than dateStart.";

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };

    /**
     *
     * @return minimum days for a section
     */
    int minDays() default 54;

    /**
     *
     * @return maximum days for a section
     */
    int maxDays() default 120;
}
