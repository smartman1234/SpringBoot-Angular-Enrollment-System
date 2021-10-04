package io.spring.enrollmentsystem.common.security;

import io.spring.enrollmentsystem.feature.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("webSecurity")
public class WebSecurity {
    public boolean hasUserId(UUID userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId().equals(userId);
        }

        return false;
    }

    public boolean hasStudentId(UUID studentId) {
        return hasUserId(studentId);
    }
}