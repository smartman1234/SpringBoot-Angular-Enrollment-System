package io.spring.enrollmentsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.dto.UserDto;
import io.spring.enrollmentsystem.entity.User;
import io.spring.enrollmentsystem.mapper.UserMapper;
import io.spring.enrollmentsystem.service.JwtTokenService;
import io.spring.enrollmentsystem.view.BaseView;
import io.spring.enrollmentsystem.view.UserView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController @RequestMapping("/api/v1/auth")
@Tag(name = "authentication", description = "authentication API")
@RequiredArgsConstructor @Slf4j
public class AuthenticationController {

    private final UserMapper userMapper;
    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    @Operation(summary = "Login a user by username and password", tags = "authentication")
    @JsonView(BaseView.Medium.class)
    public ResponseEntity<UserDto> login(@JsonView(UserView.LoginRequest.class)
                                         @RequestBody @Valid UserDto loginRequest,
                                         HttpServletResponse response) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        jwtTokenService.generateTokens(response);
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok().body(userMapper.toUserDto(user));
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Logout a user by access token", tags = "authentication")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {

        jwtTokenService.revokeRefreshToken(request, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/refresh")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Refresh authentication tokens by refresh token", tags = "authentication")
    public ResponseEntity<Void> refreshTokens(HttpServletRequest request, HttpServletResponse response) {

        jwtTokenService.tokensRotationByRefreshToken(request, response);
        return ResponseEntity.ok().build();
    }
}
