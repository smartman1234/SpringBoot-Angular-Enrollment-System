package io.spring.enrollmentsystem.common.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.MultiValueMap;

/**
 * This service converts parameters map to JPA specifications
 * Query parameter examples:
 * 1. /sections/?term.termName[eqIc]=Spring Semester 2022
 * &course.subject.subjectAcronym[eqIc]=ACC&sectionStatus[eqIc]=OPEN
 * 2. /sections/?section.term.termName[eqIc]=Spring Semester 2022
 * &enrollmentStatus[inIc]=Enrolled,WaitList
 * Special filter with 'OR' operator:
 * /sections?term.termName[eqIc]=Spring Semester 2022
 * &course.subject.subjectAcronym[eqIc]=ACC
 * &specialFilter=meetingDays[likeIc]=Mo[or]meetingDays[likeIc]=We
 */
public interface SpecificationService {

    <T> Specification<T> getSpecifications(MultiValueMap<String, String> parameters);
}
