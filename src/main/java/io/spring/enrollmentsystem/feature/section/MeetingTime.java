package io.spring.enrollmentsystem.feature.section;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = MeetingTimeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MeetingTime {
    String message() default "MeetingTimeEnd must be at least {minMinutes} minutes more than meetingTimeStart. " +
            "MeetingTimeStart must be in range [{startAfter}, {startBefore}]. " +
            "MeetingTimeEnd must be in range [{endAfter}, {endBefore}].";

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };

    /**
     *
     * @return minimum time for a section
     */
    int minMinutes() default 30;

    /**
     *
     * @return time of date that meetingTimeStart should start after
     */
    String startAfter() default "07:00:00";

    /**
     *
     * @return time of date that meetingTimeStart should start before
     */
    String startBefore() default "20:30:00";

    /**
     *
     * @return time of date that meetingTimeEnd should end after
     */
    String endAfter() default "07:30:00";

    /**
     *
     * @return time of date that meetingTimeEnd should end before
     */
    String endBefore() default "23:30:00";
}
