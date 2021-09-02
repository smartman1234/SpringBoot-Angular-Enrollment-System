package io.spring.enrollmentsystem.constant;

public enum EnrollmentStatus {
    ENROLLED("Enrolled"),
    ON_WAITLIST("On waiting list"),
    IN_CART("In shopping cart");

    private final String status;

    EnrollmentStatus(String status) {
        this.status = status;
    }

    public String status() {
        return this.status;
    }
}
