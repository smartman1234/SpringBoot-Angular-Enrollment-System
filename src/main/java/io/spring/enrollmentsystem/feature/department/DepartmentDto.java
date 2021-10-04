package io.spring.enrollmentsystem.feature.department;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

/**
 * (Department) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DepartmentDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "Urban and Regional Planning")
    @NotNull @Size(max = 100)
    private String departmentName;

    @JsonView(BaseView.Medium.class)
    @Schema(example = "2d57edfd-8297-4dd2-9de7-c9ab81cb53eb")
    @NotNull(groups = {ValidationGroup.onCreate.class})
    private UUID collegeId;

}