package io.spring.enrollmentsystem.bootstrap;

import io.spring.enrollmentsystem.configuration.SystemProperties;
import io.spring.enrollmentsystem.dto.AuthorityDto;
import io.spring.enrollmentsystem.dto.UserDto;
import io.spring.enrollmentsystem.entity.Authority;
import io.spring.enrollmentsystem.entity.User;
import io.spring.enrollmentsystem.repository.AuthorityRepository;
import io.spring.enrollmentsystem.repository.UserRepository;
import io.spring.enrollmentsystem.service.AuthorityService;
import io.spring.enrollmentsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

import static io.spring.enrollmentsystem.constant.RoleName.ADMIN;
import static io.spring.enrollmentsystem.constant.RoleName.STUDENT;

@Component
@RequiredArgsConstructor
public class DatabaseInitialization implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final UserService userService;
    private final AuthorityService authorityService;
    private final SystemProperties systemProperties;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (authorityRepository.count() == 0) {
            loadAuthorities();
        }

        if (userRepository.count() == 0) {
            loadUsers();
        }
    }

    private void loadAuthorities() {
        authorityService.createAuthority(AuthorityDto.builder().role(ADMIN.getName()).build());
        authorityService.createAuthority(AuthorityDto.builder().role(STUDENT.getName()).build());
    }

    private void loadUsers() {
        // admin user
        User adminUser = new User(systemProperties.getAdminUserName(),
                              "Khoa",
                              "Le",
                              passwordEncoder.encode(systemProperties.getAdminPassword()));

        adminUser.setEnabled(true);
        Authority adminRole = authorityRepository.findByRole(ADMIN.getName()).orElse(null);
        adminUser.getAuthorities().add(adminRole);
        userRepository.save(adminUser);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                adminUser, null, adminUser.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        // test user
        Set<AuthorityDto> authorities = new HashSet<>();
        authorities.add(AuthorityDto.builder().role(STUDENT.getName()).build());
        for (int i = 0; i < 50; i++) {
            UserDto userDto = UserDto.builder()
                    .username(randomString())
                    .firstName(randomString())
                    .lastName(randomString())
                    .password("aaaabbbb")
                    .authorities(authorities)
                    .build();

            userService.createUser(userDto);
        }
    }

    private boolean randomBoolean() {
        Random random = new Random();
        return random.nextBoolean();
    }

    private String randomString() {
        Random random = new Random();
        return Long.toString(random.nextLong() & Long.MAX_VALUE, 36);
    }

    private int randomInteger(int start, int end, int step) {
        return new Random().nextInt((end - start) / step) * step + start;
    }

    private int randomInteger(int upperBound, int step) {
        return randomInteger(0, upperBound, step);
    }

    private int randomInteger(int upperBound) {
        return randomInteger(upperBound, 1);
    }
}
