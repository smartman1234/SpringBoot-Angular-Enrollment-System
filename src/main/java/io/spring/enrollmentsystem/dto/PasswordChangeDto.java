package io.spring.enrollmentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PasswordChangeDto {

    @NotBlank
    private String currentPassword;

    @NotBlank
    private String newPassword;
}
