package io.spring.enrollmentsystem.feature.instructor;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

/**
 * (Instructor) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface InstructorMapper {

    InstructorMapper INSTANCE = Mappers.getMapper(InstructorMapper.class);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "userId", source = "user.id")
    InstructorDto toInstructorDto(Instructor instructor);

    @Mapping(target = "department", source = "departmentId")
    @Mapping(target = "user", source = "userId")
    @Mapping(target = "email", ignore = true)
    Instructor toInstructor(InstructorDto instructorDto);

    @Mapping(target = "email", ignore = true)
    @Mapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
            target = "department", source = "departmentId",
            conditionExpression = "java(instructorDto.getDepartmentId() != null"
                    + " && instructor != null && (instructor.getDepartment() == null"
                    + " || !instructorDto.getDepartmentId().equals(instructor.getDepartment().getId())))")
    Instructor toExistingInstructor(InstructorDto instructorDto, @MappingTarget Instructor instructor);

}