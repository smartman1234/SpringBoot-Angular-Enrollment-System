package io.spring.enrollmentsystem.feature.student;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.user.User_;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

/**
 * (Student) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class StudentDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(AdminView.AdminMedium.class)
    @Schema(example = "97837862-f3ad-4540-bd9b-d654ae48248b")
    @NotNull(groups = ValidationGroup.onCreate.class)
    private UUID userId;

    @JsonView({BaseView.High.class})
    @Schema(example = "nathanieldoak@cccd.edu")
    private String email;

    @JsonView({BaseView.Medium.class, AdminView.AdminLow.class})
    @Schema(example = "16")
    @Max(20)
    private Integer maxUnit = 16;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Nathaniel")
    @QuerySelectHint(Student_.USER + KEY_SEPARATOR + User_.FIRST_NAME)
    private String firstName;

    @JsonView(BaseView.VeryHigh.class)
    @Schema(example = "Doak")
    @QuerySelectHint(Student_.USER + KEY_SEPARATOR + User_.LAST_NAME)
    private String lastName;

}