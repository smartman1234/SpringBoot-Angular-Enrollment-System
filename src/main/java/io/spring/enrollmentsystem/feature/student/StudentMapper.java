package io.spring.enrollmentsystem.feature.student;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Student) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface StudentMapper {

    StudentMapper INSTANCE = Mappers.getMapper(StudentMapper.class);

    @Mapping(target = "userId", source = "user.id")
    StudentDto toStudentDto(Student student);

    @Mapping(target = "user", source = "userId")
    @Mapping(target = "email", ignore = true)
    Student toStudent(StudentDto studentDto);

    @Mapping(target = "email", ignore = true)
    Student toExistingStudent(StudentDto studentDto, @MappingTarget Student student);
}