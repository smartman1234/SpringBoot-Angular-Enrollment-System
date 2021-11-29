package io.spring.enrollmentsystem.feature.course;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

/**
 * (Course) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CourseDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "ABM 2240")
    @NotNull
    private String courseCode;

    @JsonView(BaseView.Low.class)
    @Schema(example = "Accounting for Agribusiness I")
    @Size(max = 200)
    private String courseName;

    @JsonView(BaseView.Low.class)
    @Schema(example = "Presentation of the underlying framework and concepts of financial accounting " +
            "used by businesses and organizations in the food and agribusiness industries. Students " +
            "learn how accounting information is collected and organized to evaluate the performance " +
            "and financial status of organizations. Topics include the basics of recording transactions " +
            "as well as accounting for assets, liabilities, owner’s equity, cash flows, revenue and net " +
            "income. Additionally, students will learn the preparation of financial statements using " +
            "generally accepted accounting principles (GAAP).")
    @Size(max = 3000)
    private String courseDescription;

    @JsonView(BaseView.Low.class)
    @Schema(example = "3")
    @NotNull @Min(0)
    private Integer courseUnit;

    @JsonView(BaseView.Low.class)
    @Schema(example = "d7073709-d6eb-4e41-951d-89e7fa68d237")
    @NotNull
    private UUID subjectId;

}