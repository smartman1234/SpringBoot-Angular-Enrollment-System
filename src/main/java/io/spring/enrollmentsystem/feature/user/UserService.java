package io.spring.enrollmentsystem.feature.user;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import io.spring.enrollmentsystem.feature.authority.Authority;
import io.spring.enrollmentsystem.feature.authority.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import javax.validation.ValidationException;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.Role.RoleName.STUDENT;

@Service
@RequiredArgsConstructor @Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final UserMapper userMapper;
    private final PatchService patchService;
    private final PasswordEncoder passwordEncoder;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public User getUserById(UUID userId) {
        return userRepository.findWithAuthoritiesById(userId).orElseThrow(
                () -> new ResourceNotFoundException(User.class, userId));
    }

    @Transactional(readOnly = true)
    public UserDto getUserDtoById(UUID userId) {
        return userMapper.toUserDto(getUserById(userId));
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getUserDtoPageable(MultiValueMap<String, String> parameters, Pageable pageable) {
        return userRepository
                .findAll(User.class, specificationService.getSpecifications(parameters), pageable)
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
        return userMapper.toUserDto(userMapper.toExistingUser(userDto, currentUser));
    }

    @Transactional
    public UserDto patchUser(UUID userId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        User currentUser = getUserById(userId);

        UserDto currentUserDto = userMapper.toUserDto(currentUser);

        UserDto patchedUserDto = patchService.mergePatch(mergePatchDocument, currentUserDto,
                                                         UserDto.class, viewClass);

        return userMapper.toUserDto(userMapper.toExistingUser(patchedUserDto, currentUser));
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
