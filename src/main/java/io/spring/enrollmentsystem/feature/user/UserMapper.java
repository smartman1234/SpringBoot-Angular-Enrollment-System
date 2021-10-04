package io.spring.enrollmentsystem.feature.user;

import io.spring.enrollmentsystem.feature.authority.AuthorityMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(uses = {AuthorityMapper.class})
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "password", ignore = true)
    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User toUser(UserDto userDto);

    @Mapping(target = "password", ignore = true)
    @Mapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
            target = "enabled")
    @Mapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
            target = "authorities")
    User toExistingUser(UserDto userDto, @MappingTarget User user);
}
