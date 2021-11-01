package io.spring.enrollmentsystem.feature.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import io.spring.enrollmentsystem.common.configuration.JwtProperties;
import io.spring.enrollmentsystem.common.service.CookieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtTokenService {

    private final CustomUserDetailsService customUserDetailsService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CookieService cookieService;
    private final JwtProperties jwtProperties;
    private final JwtBuilder jwtBuilder;
    private final JwtParser jwtParser;

    @Transactional
    public void tokensRotationByRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        revokeRefreshToken(request, response);
        generateTokens(response);
    }

    @Transactional
    public void revokeRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        String tokenType = request.getRequestURI().equals(jwtProperties.getRefreshCookieUrl()) ? "refresh" : "access";
        String cookieName = tokenType.equals("refresh")
                ? jwtProperties.getRefreshCookieName()
                : jwtProperties.getAccessCookieName();

        Optional<String> optionalToken = cookieService.getCookieValue(request, cookieName);
        Optional<Claims> optionalClaims = getValidatedClaims(optionalToken);

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

    @Transactional
    public void generateTokens(HttpServletResponse response) {
        Optional<UUID> optionalUserId = customUserDetailsService.getCurrentUserId();
        Set<String> authorities = customUserDetailsService.getCurrentUserAuthorities();

        if (optionalUserId.isPresent() && !authorities.isEmpty()) {
            String jti = UUID.randomUUID().toString();
            UUID userId = optionalUserId.get();
            String accessToken = generateAccessToken(userId, jti, authorities);
            String refreshToken = generateRefreshToken(userId, jti, authorities);

            // add refresh token to whitelist
            refreshTokenRepository.save(new RefreshToken(jti, userId.toString(),
                                                         jwtProperties.getRefreshExpirationTime()));

            addTokenCookies(response, accessToken, refreshToken);
        }
    }

    private void addTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        cookieService.addHttpOnlyCookie(response, jwtProperties.getAccessCookieName(), accessToken, "/",
                                        jwtProperties.getAccessExpirationTime().intValue());
        cookieService.addHttpOnlyCookie(response,
                                        jwtProperties.getRefreshCookieName(),
                                        refreshToken,
                                        jwtProperties.getRefreshCookieUrl(),
                                        jwtProperties.getRefreshExpirationTime().intValue());
        cookieService.addCookie(response,
                                "REFRESH-TOKEN-TTL",
                                jwtProperties.getRefreshExpirationTime().toString(),
                                "/",
                                jwtProperties.getRefreshExpirationTime().intValue());
    }

    private void deleteTokenCookies(HttpServletResponse response) {
        cookieService.deleteHttpOnlyCookie(response, jwtProperties.getAccessCookieName(), "/");
        cookieService.deleteHttpOnlyCookie(response,
                                           jwtProperties.getRefreshCookieName(),
                                           jwtProperties.getRefreshCookieUrl());
        cookieService.deleteCookie(response, "REFRESH-TOKEN-TTL", "/");
    }

    public String generateAccessToken(UUID userId, String jti, Set<String> authorities) {
        Date expiration = new Date(System.currentTimeMillis() + jwtProperties.getAccessExpirationTime() * 1000);
        return this.generateToken(userId, jti, authorities, expiration);
    }

    public String generateRefreshToken(UUID userId, String jti, Set<String> authorities) {
        Date expiration = new Date(System.currentTimeMillis() + jwtProperties.getRefreshExpirationTime() * 1000);
        return this.generateToken(userId, jti, authorities, expiration);
    }

    public String generateToken(UUID userId, String jti, Set<String> authorities, Date expiration) {
        return jwtBuilder
                .setHeaderParam("typ", jwtProperties.getTokenType())
                .setIssuer(jwtProperties.getTokenIssuer())
                .setAudience(jwtProperties.getTokenAudience())
                .setSubject(userId.toString())
                .setId(jti)
                .claim("rol", authorities)
                .setExpiration(expiration)
                .compact();
    }

    public Claims parseClaimsJws(String token) {
        return jwtParser
                .parseClaimsJws(token)
                .getBody();
    }

    public Optional<Claims> getValidatedClaims(Optional<String> token) {
        if (token.isEmpty()) {
            return Optional.empty();
        }

        try {
            return Optional.ofNullable(parseClaimsJws(token.get()));
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature - {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token - {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token - {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token - {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty - {}", ex.getMessage());
        }

        return Optional.empty();
    }
}
