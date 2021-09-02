package io.spring.enrollmentsystem.service;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.dto.PasswordChangeDto;
import io.spring.enrollmentsystem.dto.UserDto;
import io.spring.enrollmentsystem.entity.Authority;
import io.spring.enrollmentsystem.entity.User;
import io.spring.enrollmentsystem.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.mapper.UserMapper;
import io.spring.enrollmentsystem.repository.AuthorityRepository;
import io.spring.enrollmentsystem.repository.UserRepository;
import io.spring.enrollmentsystem.utility.PatchUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static io.spring.enrollmentsystem.constant.RoleName.STUDENT;

@Service
@RequiredArgsConstructor @Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final UserMapper userMapper;
    private final PatchUtility patchUtility;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException(User.class, userId));
    }

    @Transactional(readOnly = true)
    public UserDto getUserDtoById(UUID userId) {
        return userMapper.toUserDto(getUserById(userId));
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getUserDtoPageable(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toUserDto);
    }

    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (isUsernameAlreadyExisted(userDto.getUsername())) {
            throw new ValidationException("Username is already registered!");
        }

        User user = userMapper.toUser(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        if (userDto.getEnabled() == null) {
            user.setEnabled(true);
        }
        if (userDto.getAuthorities() == null || userDto.getAuthorities().isEmpty()) {
            Authority role = authorityRepository.findByRole(STUDENT.getName()).orElse(null);
            user.setAuthorities(new HashSet<>());
            user.getAuthorities().add(role);
        }

        return userMapper.toUserDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUser(UUID userId, UserDto userDto) {
        User currentUser = getUserById(userId);
        userMapper.toExistingUser(userDto, currentUser);
        return userMapper.toUserDto(currentUser);
    }

    @Transactional
    public UserDto patchUser(UUID userId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        User currentUser = getUserById(userId);

        UserDto currentUserDto = userMapper.toUserDto(currentUser);

        UserDto patchedUserDto = patchUtility.mergePatch(mergePatchDocument, currentUserDto,
                                                         UserDto.class, viewClass);

        userMapper.toExistingUser(patchedUserDto, currentUser);

        return userMapper.toUserDto(currentUser);
    }

    @Transactional
    public void deleteById(UUID userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new ResourceNotFoundException(User.class, userId);
        }
    }

    @Transactional
    public void changeUserPassword(UUID userId, PasswordChangeDto passwordChangeDto) {
        User user = getUserById(userId);
        String currentPassword = passwordChangeDto.getCurrentPassword();
        String newPassword = passwordChangeDto.getNewPassword();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ValidationException("Incorrect current password!");
        }
        if (currentPassword.equals(newPassword)) {
            throw new ValidationException("New password must be different from current password!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
    }

    @Transactional(readOnly = true)
    public boolean isUserEnabled(UUID id) {
        Optional<User> user = userRepository.findById(id);
        return user.isPresent() && user.get().isEnabled();
    }

    @Transactional(readOnly = true)
    public boolean isUsernameAlreadyExisted(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
