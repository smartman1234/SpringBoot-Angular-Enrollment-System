package io.spring.enrollmentsystem.feature.enrollment;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;
import java.util.UUID;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class EnrollmentIdDto {

//    @Schema(example = "315d277c-8387-4b26-8da2-58d4bcea0f17")
//    private UUID studentId;

    @Schema(example = "2e7aca37-3712-4762-bf6a-f873c7e5c0c1")
    private UUID sectionId;

    @Schema(example = "Enrolled")
    private String enrollmentStatus;
}
