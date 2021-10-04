package io.spring.enrollmentsystem.feature.building;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Building) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Mapper(uses = {})
public interface BuildingMapper {

    BuildingMapper INSTANCE = Mappers.getMapper(BuildingMapper.class);

    BuildingDto toBuildingDto(Building building);

    Building toBuilding(BuildingDto buildingDto);

    Building toExistingBuilding(BuildingDto buildingDto, @MappingTarget Building building);
}