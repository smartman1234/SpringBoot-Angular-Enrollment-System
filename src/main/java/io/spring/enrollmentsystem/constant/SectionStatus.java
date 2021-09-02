package io.spring.enrollmentsystem.constant;

public enum SectionStatus {
    OPEN("Open"),
    WAITLIST("Wait List"),
    CLOSED("Closed");

    private final String status;

    SectionStatus(String status) {
        this.status = status;
    }

    public String status() {
        return this.status;
    }
}
