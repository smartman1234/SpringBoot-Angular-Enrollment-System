package io.spring.enrollmentsystem.constant;

import org.springframework.stereotype.Component;

@Component("Role")
public class Role {
    public static final String ADMIN = RoleName.ADMIN.role();
    public static final String STUDENT = RoleName.STUDENT.role();
}
