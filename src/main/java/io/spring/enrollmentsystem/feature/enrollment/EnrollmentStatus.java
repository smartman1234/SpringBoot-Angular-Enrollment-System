package io.spring.enrollmentsystem.feature.enrollment;

public enum EnrollmentStatus {
    ENROLLED("Enrolled"),
    ON_WAITLIST("WaitList"),
    IN_CART("Cart");

    private final String status;

    EnrollmentStatus(String status) {
        this.status = status;
    }

    public String status() {
        return this.status;
    }
}
