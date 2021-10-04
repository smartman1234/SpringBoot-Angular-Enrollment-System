package io.spring.enrollmentsystem.feature.instructor;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.department.Department_;
import io.spring.enrollmentsystem.feature.user.User_;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

/**
 * (Instructor) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class InstructorDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Medium.class)
    @Schema(example = "97837862-f3ad-4540-bd9b-d654ae48248b")
    @NotNull(groups = ValidationGroup.onCreate.class)
    private UUID userId;

    @JsonView(BaseView.Low.class)
    @Schema(example = "9ccb0ce7-7df5-48a1-becd-b790a3efbdcb")
    private UUID departmentId;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Krik")
    @QuerySelectHint(Instructor_.USER + KEY_SEPARATOR + User_.FIRST_NAME)
    private String firstName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Hatchel")
    @QuerySelectHint(Instructor_.USER + KEY_SEPARATOR + User_.LAST_NAME)
    private String lastName;

}