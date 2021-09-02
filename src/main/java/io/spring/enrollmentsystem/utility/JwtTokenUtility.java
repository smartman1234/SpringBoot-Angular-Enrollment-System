package io.spring.enrollmentsystem.utility;

import io.jsonwebtoken.*;
import io.spring.enrollmentsystem.configuration.JwtProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenUtility {

    private final JwtProperties jwtProperties;
    private final JwtBuilder jwtBuilder;
    private final JwtParser jwtParser;

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
        } catch (SecurityException ex) {
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
