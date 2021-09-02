package io.spring.enrollmentsystem.service;

import io.jsonwebtoken.Claims;
import io.spring.enrollmentsystem.configuration.JwtProperties;
import io.spring.enrollmentsystem.entity.RefreshToken;
import io.spring.enrollmentsystem.exception.InvalidAccessTokenException;
import io.spring.enrollmentsystem.exception.InvalidRefreshTokenException;
import io.spring.enrollmentsystem.repository.RefreshTokenRepository;
import io.spring.enrollmentsystem.utility.CookieUtility;
import io.spring.enrollmentsystem.utility.JwtTokenUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtTokenService {

    private final AuthenticationService authenticationService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;
    private final CookieUtility cookieUtility;
    private final JwtTokenUtility jwtTokenUtility;

    public void tokensRotationByRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        revokeRefreshToken(request, response);
        generateTokens(response);
    }

    public void revokeRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        String tokenType = request.getRequestURI().equals(jwtProperties.getRefreshCookieUrl()) ? "refresh" : "access";
        String cookieName = tokenType.equals("refresh")
                ? jwtProperties.getRefreshCookieName()
                : jwtProperties.getAccessCookieName();

        Optional<String> optionalToken = cookieUtility.getCookieValue(request, cookieName);
        Optional<Claims> optionalClaims = jwtTokenUtility.getValidatedClaims(optionalToken);

        if (optionalToken.isEmpty() || optionalClaims.isEmpty()) {
            if (tokenType.equals("refresh")) {
                throw new InvalidRefreshTokenException();
            } else {
                throw new InvalidAccessTokenException();
            }
        }

        Claims claims = optionalClaims.get();
        String jti = claims.getId();

        deleteTokenCookies(response);

        if (refreshTokenRepository.existsById(jti)) {
            // remove refresh token from whitelist
            refreshTokenRepository.deleteById(jti);
        } else {
            // if refresh token is not valid, invalidate all refresh tokens of current user
            String userId = claims.getSubject();
            refreshTokenRepository
                    .findAllByUserId(userId)
                    .forEach(refreshTokenRepository::delete);
            throw new InvalidRefreshTokenException();
        }
    }

    public void generateTokens(HttpServletResponse response) {
        Optional<UUID> optionalUserId = authenticationService.getCurrentUserId();
        Set<String> authorities = authenticationService.getCurrentUserAuthorities();

        if (optionalUserId.isPresent() && !authorities.isEmpty()) {
            String jti = UUID.randomUUID().toString();
            UUID userId = optionalUserId.get();
            String accessToken = jwtTokenUtility.generateAccessToken(userId, jti, authorities);
            String refreshToken = jwtTokenUtility.generateRefreshToken(userId, jti, authorities);

            // add refresh token to whitelist
            refreshTokenRepository.save(new RefreshToken(jti, userId.toString(),
                                                         jwtProperties.getRefreshExpirationTime()));

            addTokenCookies(response, accessToken, refreshToken);
        }
    }

    private void addTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        cookieUtility.addHttpOnlyCookie(response, jwtProperties.getAccessCookieName(), accessToken, "/",
                                        jwtProperties.getAccessExpirationTime().intValue());
        cookieUtility.addHttpOnlyCookie(response,
                                        jwtProperties.getRefreshCookieName(),
                                        refreshToken,
                                        jwtProperties.getRefreshCookieUrl(),
                                        jwtProperties.getRefreshExpirationTime().intValue());
        cookieUtility.addCookie(response,
                                "REFRESH-TOKEN-TTL",
                                jwtProperties.getRefreshExpirationTime().toString(),
                                "",
                                jwtProperties.getRefreshExpirationTime().intValue());
    }

    private void deleteTokenCookies(HttpServletResponse response) {
        cookieUtility.deleteHttpOnlyCookie(response, jwtProperties.getAccessCookieName(), "/");
        cookieUtility.deleteHttpOnlyCookie(response,
                                           jwtProperties.getRefreshCookieName(),
                                           jwtProperties.getRefreshCookieUrl());
        cookieUtility.deleteCookie(response, "REFRESH-TOKEN-TTL", "");
    }
}
