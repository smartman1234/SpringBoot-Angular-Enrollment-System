package io.spring.enrollmentsystem.feature.enrollment;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Enrollment) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface EnrollmentMapper {

    EnrollmentMapper INSTANCE = Mappers.getMapper(EnrollmentMapper.class);

    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "sectionId", source = "section.id")
    EnrollmentDto toEnrollmentDto(Enrollment enrollment);

    @Mapping(target = "student", source = "studentId")
    @Mapping(target = "section", source = "sectionId")
    @Mapping(target = "enrollmentStatus", ignore = true)
    @Mapping(target = "accessCode", ignore = true)
    Enrollment toEnrollment(EnrollmentDto enrollmentDto);

    Enrollment toExistingEnrollment(EnrollmentDto enrollmentDto, @MappingTarget Enrollment enrollment);

}