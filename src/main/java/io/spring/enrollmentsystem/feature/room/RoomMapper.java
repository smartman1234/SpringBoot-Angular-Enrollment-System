package io.spring.enrollmentsystem.feature.room;

import io.spring.enrollmentsystem.common.mapper.ReferenceMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Room) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {ReferenceMapper.class})
public interface RoomMapper {

    RoomMapper INSTANCE = Mappers.getMapper(RoomMapper.class);

    @Mapping(target = "buildingId", source = "building.id")
    RoomDto toRoomDto(Room room);

    @Mapping(target = "building", source = "buildingId")
    Room toRoom(RoomDto roomDto);

    Room toExistingRoom(RoomDto roomDto, @MappingTarget Room room);

}