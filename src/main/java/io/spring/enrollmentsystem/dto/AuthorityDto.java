package io.spring.enrollmentsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthorityDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @Schema(example = "ROLE_ADMIN")
    @JsonView(BaseView.Low.class)
    @NotBlank
    private String role;
}
