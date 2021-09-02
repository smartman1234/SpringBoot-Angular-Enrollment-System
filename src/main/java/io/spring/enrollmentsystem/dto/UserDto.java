package io.spring.enrollmentsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.validator.ValidationGroup;
import io.spring.enrollmentsystem.view.AdminView;
import io.spring.enrollmentsystem.view.BaseView;
import io.spring.enrollmentsystem.view.UserView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Set;
import java.util.UUID;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class UserDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView({BaseView.Medium.class, UserView.LoginRequest.class})
    @NotBlank(groups = ValidationGroup.onCreate.class)
    private String username;

    @JsonView({AdminView.Create.class, UserView.LoginRequest.class})
    @NotBlank(groups = ValidationGroup.onCreate.class)
    private String password;

    @Schema(example = "true")
    @JsonView(AdminView.Low.class)
    private Boolean enabled;

    @Schema(example = "Khoa")
    @JsonView({BaseView.Low.class})
    private String firstName;

    @Schema(example = "Le")
    @JsonView({BaseView.Low.class})
    private String lastName;

    @JsonView({AdminView.Low.class})
    private Set<AuthorityDto> authorities;
}
