package io.spring.enrollmentsystem.feature.subject;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

/**
 * (Subject) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface SubjectMapper {

    SubjectMapper INSTANCE = Mappers.getMapper(SubjectMapper.class);

    @Mapping(target = "departmentId", source = "department.id")
    SubjectDto toSubjectDto(Subject subject);

    @Mapping(target = "department", source = "departmentId")
    Subject toSubject(SubjectDto subjectDto);

    @Mapping(target = "subjectAcronym", ignore = true)
    @Mapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
            target = "department", source = "departmentId",
            conditionExpression = "java(subjectDto.getDepartmentId() != null"
                    + " && subject != null && (subject.getDepartment() == null"
                    + " || !subjectDto.getDepartmentId().equals(subject.getDepartment().getId())))")
    Subject toExistingSubject(SubjectDto subjectDto, @MappingTarget Subject subject);

}