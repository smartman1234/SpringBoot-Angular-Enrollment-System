package io.spring.enrollmentsystem.configuration.security;

import io.jsonwebtoken.Claims;
import io.spring.enrollmentsystem.configuration.JwtProperties;
import io.spring.enrollmentsystem.configuration.SystemProperties;
import io.spring.enrollmentsystem.entity.Authority;
import io.spring.enrollmentsystem.service.JwtTokenService;
import io.spring.enrollmentsystem.utility.CookieUtility;
import io.spring.enrollmentsystem.utility.JwtTokenUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtility jwtTokenUtility;
    private final CookieUtility cookieUtility;
    private final JwtProperties jwtProperties;
    private final SystemProperties systemProperties;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String currentRequestURI = request.getRequestURI();
        return systemProperties.getPublicEndpoints().contains(currentRequestURI);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String cookieName = request.getRequestURI().equals(jwtProperties.getRefreshCookieUrl())
                ? jwtProperties.getRefreshCookieName()
                : jwtProperties.getAccessCookieName();

        Optional<String> optionalToken = cookieUtility.getCookieValue(request, cookieName);
        Optional<Claims> optionalClaims = jwtTokenUtility.getValidatedClaims(optionalToken);

        if (optionalClaims.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        Claims claims = optionalClaims.get();
        UUID userId = UUID.fromString(claims.getSubject());
        Set<? extends GrantedAuthority> authorities =
                ((ArrayList<?>) claims
                        .get("rol"))
                        .stream()
                        .map(authority -> new Authority((String) authority))
                        .collect(Collectors.toCollection(HashSet::new));

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userId, null, authorities
        );

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
