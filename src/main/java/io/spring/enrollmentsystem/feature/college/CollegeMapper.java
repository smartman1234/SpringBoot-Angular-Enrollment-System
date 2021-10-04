package io.spring.enrollmentsystem.feature.college;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (College) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Mapper(uses = {})
public interface CollegeMapper {

    CollegeMapper INSTANCE = Mappers.getMapper(CollegeMapper.class);

    CollegeDto toCollegeDto(College college);

    College toCollege(CollegeDto collegeDto);

    College toExistingCollege(CollegeDto collegeDto, @MappingTarget College college);
}