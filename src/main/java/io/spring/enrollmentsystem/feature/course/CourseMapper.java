package io.spring.enrollmentsystem.feature.course;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Course) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface CourseMapper {

    CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);

    @Mapping(target = "subjectId", source = "subject.id")
    CourseDto toCourseDto(Course course);

    @Mapping(target = "subject", source = "subjectId")
    Course toCourse(CourseDto courseDto);

    Course toExistingCourse(CourseDto courseDto, @MappingTarget Course course);
}