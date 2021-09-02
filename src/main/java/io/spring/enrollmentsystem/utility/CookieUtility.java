package io.spring.enrollmentsystem.utility;

import io.spring.enrollmentsystem.configuration.JwtProperties;
import io.spring.enrollmentsystem.configuration.SystemProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@Component @Slf4j
@RequiredArgsConstructor
public class CookieUtility {

    private final SystemProperties systemProperties;

    public void addHttpOnlyCookie(HttpServletResponse response, String name, String value, String path, int maxAge) {
        this.setCookie(response, name, value, path, maxAge, true);
    }

    public void addCookie(HttpServletResponse response, String name, String value, String path, int maxAge) {
        this.setCookie(response, name, value, path, maxAge, false);
    }

    public void deleteHttpOnlyCookie(HttpServletResponse response, String name, String path) {
        this.setCookie(response, name, "", path, 0, true);
    }

    public void deleteCookie(HttpServletResponse response, String name, String path) {
        this.setCookie(response, name, "", path, 0, false);
    }

    public void setCookie(HttpServletResponse response, String name, String value,
                          String path, int maxAge, boolean isHttpOnly) {
        setCookie(response, name, value, path, maxAge, isHttpOnly, systemProperties.getCookieSameSite());
    }

    public void setCookie(HttpServletResponse response, String name, String value,
                          String path, int maxAge, boolean isHttpOnly, String sameSiteMode) {
        ResponseCookie cookie = ResponseCookie
                .from(name, value)
                .path(path)
                .maxAge(maxAge)
                .httpOnly(isHttpOnly)
                .secure(systemProperties.getCookieSecure())
                .sameSite(sameSiteMode)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public Optional<String> getCookieValue(HttpServletRequest request, String name) {
        Cookie cookie = WebUtils.getCookie(request, name);
        return cookie != null ? Optional.of(cookie.getValue()) : Optional.empty();
    }
}