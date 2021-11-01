package io.spring.enrollmentsystem.feature.section;

public enum SectionStatus {
    OPEN("Open"),
    WAIT_LIST("WaitList"),
    CLOSED("Closed");

    private final String status;

    SectionStatus(String status) {
        this.status = status;
    }

    public String status() {
        return this.status;
    }
}
