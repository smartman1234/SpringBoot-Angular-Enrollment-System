package io.spring.enrollmentsystem.feature.section;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.building.Building_;
import io.spring.enrollmentsystem.feature.course.Course_;
import io.spring.enrollmentsystem.feature.instructor.Instructor_;
import io.spring.enrollmentsystem.feature.room.Room_;
import io.spring.enrollmentsystem.feature.term.Term_;
import io.spring.enrollmentsystem.feature.user.User_;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

/**
 * (Section) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
@MeetingDate
@MeetingTime
public class SectionDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.High.class)
    @Schema(example = "2")
    private Integer sectionNumber;

    @JsonView(BaseView.Low.class)
    @Schema(example = "MoWe")
    @Size(max = 50)
    private String meetingDays;

    @JsonView(BaseView.Low.class)
    @Schema(example = "08:00:00", ref = "MeetingTimeStart")
    private LocalTime meetingTimeStart;

    @JsonView(BaseView.Low.class)
    @Schema(example = "08:50:00", ref = "MeetingTimeEnd")
    private LocalTime meetingTimeEnd;

    @JsonView(BaseView.Low.class)
    @Schema(example = "35")
    @NotNull
    private Integer classCapacity;

    @JsonView(BaseView.Low.class)
    @Schema(example = "10")
    @NotNull
    private Integer waitlistCapacity;

    @JsonView(BaseView.Low.class)
    @Schema(example = "0")
    private Integer enrolledNumber = 0;

    @JsonView(BaseView.Low.class)
    @Schema(example = "0")
    private Integer waitingNumber = 0;

    @JsonView(BaseView.Low.class)
    @Schema(example = "2021-8-23")
    @NotNull
    private LocalDate dateStart;

    @JsonView(BaseView.Low.class)
    @Schema(example = "2021-12-10")
    @NotNull
    private LocalDate dateEnd;

    @JsonView(BaseView.Low.class)
    @Schema(example = "Open")
    @Size(max = 20)
    private String sectionStatus = SectionStatus.OPEN.status();

    @JsonView(AdminView.AdminMedium.class)
    @Schema(example = "ac60d370-7bcb-4f26-80e6-a0c4dfcdf913")
    @NotNull(groups = ValidationGroup.onCreate.class)
    private UUID termId;

    @JsonView(AdminView.AdminMedium.class)
    @Schema(example = "b267509c-2fe2-4696-9b5e-c98a8b41acb7")
    @NotNull(groups = ValidationGroup.onCreate.class)
    private UUID courseId;

    @JsonView(AdminView.AdminLow.class)
    @Schema(example = "a8cd0acd-a132-47b9-85f6-4acaa9d73dc0")
    private UUID instructorId;

    @JsonView(AdminView.AdminLow.class)
    @Schema(example = "b25b62d7-7bcb-4a97-a8de-e185d5630ef6")
    private UUID roomId;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "1")
    @QuerySelectHint(Section_.ROOM + KEY_SEPARATOR + Room_.BUILDING
            + KEY_SEPARATOR + Building_.BUILDING_NUMBER)
    private Integer buildingNumber;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "3")
    @QuerySelectHint(Section_.ROOM + KEY_SEPARATOR + Room_.ROOM_NUMBER)
    private Integer roomNumber;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Hatchel")
    @QuerySelectHint(Section_.INSTRUCTOR + KEY_SEPARATOR + Instructor_.USER + KEY_SEPARATOR + User_.LAST_NAME)
    private String instructorLastName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Krik")
    @QuerySelectHint(Section_.INSTRUCTOR + KEY_SEPARATOR + Instructor_.USER + KEY_SEPARATOR + User_.FIRST_NAME)
    private String instructorFirstName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Fall Semester 2021")
    @QuerySelectHint(Section_.TERM + KEY_SEPARATOR + Term_.TERM_NAME)
    private String termName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "ABM 2240")
    @QuerySelectHint(Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_CODE)
    private String courseCode;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "3")
    @QuerySelectHint(Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_UNIT)
    private Integer courseUnit;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Accounting for Agribusiness I")
    @QuerySelectHint(Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_NAME)
    private String courseName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Presentation of the underlying framework and concepts of financial accounting " +
            "used by businesses and organizations in the food and agribusiness industries. Students " +
            "learn how accounting information is collected and organized to evaluate the performance and " +
            "financial status of organizations. Topics include the basics of recording transactions as well " +
            "as accounting for assets, liabilities, owner’s equity, cash flows, revenue and net income. " +
            "Additionally, students will learn the preparation of financial statements using generally " +
            "accepted accounting principles (GAAP).")
    @QuerySelectHint(Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_DESCRIPTION)
    private String courseDescription;

}