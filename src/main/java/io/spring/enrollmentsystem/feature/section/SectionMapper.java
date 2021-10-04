package io.spring.enrollmentsystem.feature.section;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Section) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface SectionMapper {

    SectionMapper INSTANCE = Mappers.getMapper(SectionMapper.class);

    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "termId", source = "term.id")
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "instructorId", source = "instructor.id")
    SectionDto toSectionDto(Section section);

    @Mapping(target = "room", source = "roomId")
    @Mapping(target = "term", source = "termId")
    @Mapping(target = "course", source = "courseId")
    @Mapping(target = "instructor", source = "instructorId")
    @Mapping(target = "sectionNumber", ignore = true)
    Section toSection(SectionDto sectionDto);

    @Mapping(target = "sectionNumber", ignore = true)
    Section toExistingSection(SectionDto sectionDto, @MappingTarget Section section);

}