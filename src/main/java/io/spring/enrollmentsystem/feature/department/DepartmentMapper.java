package io.spring.enrollmentsystem.feature.department;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Department) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface DepartmentMapper {

    DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);

    @Mapping(target = "collegeId", source = "college.id")
    DepartmentDto toDepartmentDto(Department department);

    @Mapping(target = "college", source = "collegeId")
    Department toDepartment(DepartmentDto departmentDto);

    Department toExistingDepartment(DepartmentDto departmentDto, @MappingTarget Department department);

}