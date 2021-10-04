package io.spring.enrollmentsystem.common.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
public @interface QuerySelectHint {

    /**
     * Hint for building criteria path
     */
    String value();
}
