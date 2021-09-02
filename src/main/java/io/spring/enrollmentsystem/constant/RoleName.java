package io.spring.enrollmentsystem.constant;

public enum RoleName {
    STUDENT("ROLE_STUDENT"),
    ADMIN("ROLE_ADMIN");

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
