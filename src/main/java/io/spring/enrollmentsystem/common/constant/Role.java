package io.spring.enrollmentsystem.common.constant;

import org.springframework.stereotype.Component;

@Component("Role")
public final class Role {
    public static final String ADMIN = RoleName.ADMIN.role();
    public static final String STUDENT = RoleName.STUDENT.role();
    public static final String INSTRUCTOR = RoleName.INSTRUCTOR.role();

    public enum RoleName {
        ADMIN("ROLE_ADMIN"),
        INSTRUCTOR("ROLE_INSTRUCTOR"),
        STUDENT("ROLE_STUDENT");

        private final String name;
        private final String role;

        RoleName(String name) {
            this.name = name;
            this.role = name.replace("ROLE_", "");
        }

        public String getName() {
            return this.name;
        }

        public String role() {
            return role;
        }
    }
}
