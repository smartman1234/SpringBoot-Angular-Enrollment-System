package io.spring.enrollmentsystem.feature.authentication;

import io.spring.enrollmentsystem.common.configuration.LoginFailAttemptCache;
import io.spring.enrollmentsystem.feature.user.User;
import io.spring.enrollmentsystem.feature.user.UserDto;
import io.spring.enrollmentsystem.feature.user.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
@RequiredArgsConstructor @Slf4j
public class AuthenticationService {

    private final UserMapper userMapper;

    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;

    private final LoginFailAttemptCache loginFailAttemptCache;

    @Transactional
    public UserDto login(HttpServletResponse response, String username, String password) {

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
                                                                                                          password);

        String ipAddress = getIpAddress();
        Integer attempts = loginFailAttemptCache.getAttemptsCache().getIfPresent(ipAddress);
        if (attempts != null && attempts >= loginFailAttemptCache.getMaxAttempt()) {
            log.info(ipAddress);
            throw new AuthenticationServiceException("Client IP address is blocked!");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            loginFailAttemptCache.getAttemptsCache().invalidate(ipAddress);  // invalidate fail attempt value
            jwtTokenService.generateTokens(response);
            return userMapper.toUserDto((User) authentication.getPrincipal());
        } catch (BadCredentialsException ex) {
            // increase fail attempt value for current client ip address
            attempts = attempts != null ? attempts : 0;
            loginFailAttemptCache.getAttemptsCache().put(ipAddress, ++attempts);
            throw ex;
        }
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        jwtTokenService.revokeRefreshToken(request, response);
    }

    @Transactional
    public void refresh(HttpServletRequest request, HttpServletResponse response) {
        jwtTokenService.tokensRotationByRefreshToken(request, response);
    }

    private String getIpAddress() {
        final String[] IP_HEADER_CANDIDATES = {
                "X-Forwarded-For",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_X_FORWARDED",
                "HTTP_X_CLUSTER_CLIENT_IP",
                "HTTP_CLIENT_IP",
                "HTTP_FORWARDED_FOR",
                "HTTP_FORWARDED",
                "HTTP_VIA",
                "REMOTE_ADDR"
        };

        if (RequestContextHolder.getRequestAttributes() == null) {
            return "0.0.0.0";
        }

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes())
                .getRequest();

        for (String header : IP_HEADER_CANDIDATES) {
            String ipList = request.getHeader(header);
            if (ipList != null && ipList.length() > 0 && !ipList.equalsIgnoreCase("unknown")) {
                return ipList.split(",")[0];
            }
        }

        return request.getRemoteAddr();
    }
}
