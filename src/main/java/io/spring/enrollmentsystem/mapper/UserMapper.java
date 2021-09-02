package io.spring.enrollmentsystem.mapper;

import io.spring.enrollmentsystem.dto.UserDto;
import io.spring.enrollmentsystem.entity.User;
import io.spring.enrollmentsystem.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.repository.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Mapper(uses = {AuthorityMapper.class})
public abstract class UserMapper {

    public static final UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Autowired
    private UserRepository userRepository;

    @Mapping(target = "password", ignore = true)
    public abstract UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    public abstract User toUser(UserDto userDto);

    @Mapping(target = "password", ignore = true)
    public abstract User toExistingUser(UserDto userDto, @MappingTarget User user);

    protected User userIdToUser(UUID userId) {
        if ( userId == null ) {
            return null;
        }
        return userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException(User.class, userId));
    }
}
