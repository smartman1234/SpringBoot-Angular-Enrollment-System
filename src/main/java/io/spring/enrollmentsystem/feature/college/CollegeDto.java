package io.spring.enrollmentsystem.feature.college;

import com.fasterxml.jackson.annotation.JsonView;
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
 * (College) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class CollegeDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "College of Business Administration")
    @NotBlank @Size(max = 100)
    private String collegeName;

}