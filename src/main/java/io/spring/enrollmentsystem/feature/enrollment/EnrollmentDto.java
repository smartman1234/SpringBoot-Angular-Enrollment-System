package io.spring.enrollmentsystem.feature.enrollment;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.building.Building_;
import io.spring.enrollmentsystem.feature.course.Course_;
import io.spring.enrollmentsystem.feature.instructor.Instructor_;
import io.spring.enrollmentsystem.feature.room.Room_;
import io.spring.enrollmentsystem.feature.section.SectionStatus;
import io.spring.enrollmentsystem.feature.section.Section_;
import io.spring.enrollmentsystem.feature.term.Term_;
import io.spring.enrollmentsystem.feature.user.User_;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

/**
 * (Enrollment) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class EnrollmentDto {

    @JsonView(BaseView.Medium.class)
    @Schema(example = "315d277c-8387-4b26-8da2-58d4bcea0f17")
    @NotNull(groups = ValidationGroup.onCreate.class)
    private UUID studentId;

    @JsonView(BaseView.Medium.class)
    @Schema(example = "2e7aca37-3712-4762-bf6a-f873c7e5c0c1")
    @NotNull(groups = ValidationGroup.onCreate.class)
    private UUID sectionId;

    @JsonView(BaseView.High.class)
    @Schema(example = "Enrolled")
    @Size(max = 45)
    private String enrollmentStatus;

    @JsonView(AdminView.AdminMedium.class)
    @Schema(example = "4d6a0c63-c822-4c90-b485-f482d1418671")
    private String accessCode;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "2")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.SECTION_NUMBER)
    private Integer sectionNumber;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "MoWe")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.MEETING_DAYS)
    private String meetingDays;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "08:00:00", ref = "MeetingTimeStart")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.MEETING_TIME_START)
    private LocalTime meetingTimeStart;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "08:50:00", ref = "MeetingTimeEnd")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.MEETING_TIME_END)
    private LocalTime meetingTimeEnd;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "35")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.CLASS_CAPACITY)
    private Integer classCapacity;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "10")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.WAITLIST_CAPACITY)
    private Integer waitlistCapacity;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "0")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.ENROLLED_NUMBER)
    private Integer enrolledNumber = 0;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "0")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.WAITING_NUMBER)
    private Integer waitingNumber = 0;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "2021-8-23")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.DATE_START)
    private LocalDate dateStart;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "2021-12-10")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.DATE_END)
    private LocalDate dateEnd;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Open")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR + Section_.SECTION_STATUS)
    private String sectionStatus = SectionStatus.OPEN.status();

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "1")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.ROOM + KEY_SEPARATOR + Room_.BUILDING
            + KEY_SEPARATOR + Building_.BUILDING_NUMBER)
    private Integer buildingNumber;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "3")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.ROOM + KEY_SEPARATOR + Room_.ROOM_NUMBER)
    private Integer roomNumber;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Hatchel")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.INSTRUCTOR + KEY_SEPARATOR
            + Instructor_.USER + KEY_SEPARATOR + User_.LAST_NAME)
    private String instructorLastName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Krik")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.INSTRUCTOR + KEY_SEPARATOR
            + Instructor_.USER + KEY_SEPARATOR + User_.FIRST_NAME)
    private String instructorFirstName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Fall Semester 2021")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.TERM + KEY_SEPARATOR + Term_.TERM_NAME)
    private String termName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "ABM 2240")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_CODE)
    private String courseCode;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "3")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_UNIT)
    private Integer courseUnit;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Accounting for Agribusiness I")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_NAME)
    private String courseName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Presentation of the underlying framework and concepts of financial accounting " +
            "used by businesses and organizations in the food and agribusiness industries. Students " +
            "learn how accounting information is collected and organized to evaluate the performance and " +
            "financial status of organizations. Topics include the basics of recording transactions as well " +
            "as accounting for assets, liabilities, owner’s equity, cash flows, revenue and net income. " +
            "Additionally, students will learn the preparation of financial statements using generally " +
            "accepted accounting principles (GAAP).")
    @QuerySelectHint(Enrollment_.SECTION + KEY_SEPARATOR +
            Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_DESCRIPTION)
    private String courseDescription;

}