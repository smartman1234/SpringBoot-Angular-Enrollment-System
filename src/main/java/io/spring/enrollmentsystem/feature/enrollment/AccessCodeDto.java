package io.spring.enrollmentsystem.feature.enrollment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class AccessCodeDto {

    @Schema(example = "4d6a0c63-c822-4c90-b485-f482d1418671")
    private String accessCode;
}
