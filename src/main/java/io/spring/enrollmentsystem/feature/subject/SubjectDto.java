package io.spring.enrollmentsystem.feature.subject;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.UUID;

/**
 * (Subject) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class SubjectDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "Agribusiness and Food Industry Management")
    @NotBlank @Size(max = 100)
    private String subjectName;

    @JsonView(BaseView.Medium.class)
    @Schema(example = "ABM")
    @NotBlank(groups = ValidationGroup.onCreate.class)
    @Size(max = 3)
    private String subjectAcronym;

    @JsonView(BaseView.Low.class)
    @Schema(example = "034aa01c-c84a-4500-86ce-d6d5b3bf10d1")
    private UUID departmentId;

}