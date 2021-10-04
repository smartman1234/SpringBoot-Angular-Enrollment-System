package io.spring.enrollmentsystem.feature.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PasswordChangeDto {

    @NotBlank
    @Schema(example = "My password")
    private String currentPassword;

    @NotBlank
    @Schema(example = "My password")
    private String newPassword;
}
