package io.spring.enrollmentsystem.entity;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom Annotation @Default for using with mapstruct mapper
 * The annotation let mapstruct choose which constructor in entity to use when initiating
 * (in case there are multiple constructors in the entity class)
 */
@Target(ElementType.CONSTRUCTOR)
@Retention(RetentionPolicy.CLASS)
public @interface Default {
}
