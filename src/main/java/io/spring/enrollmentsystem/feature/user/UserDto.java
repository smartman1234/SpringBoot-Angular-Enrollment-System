package io.spring.enrollmentsystem.feature.user;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.authority.AuthorityDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class UserDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @Schema(example = "nathanieldoak")
    @JsonView({BaseView.Medium.class, UserView.LoginRequest.class})
    @NotBlank(groups = ValidationGroup.onCreate.class)
    private String username;

    @JsonView({AdminView.AdminCreate.class, UserView.LoginRequest.class})
    @NotBlank(groups = ValidationGroup.onCreate.class)
    private String password;

    @Schema(example = "true")
    @JsonView(AdminView.AdminLow.class)
    @NotNull(groups = ValidationGroup.onCreate.class)
    private Boolean enabled;

    @Schema(example = "Nathaniel")
    @JsonView({BaseView.Low.class})
    private String firstName;

    @Schema(example = "Doak")
    @JsonView({BaseView.Low.class})
    private String lastName;

    @JsonView({AdminView.AdminLow.class})
    @NotEmpty(groups = ValidationGroup.onCreate.class)
    private Set<AuthorityDto> authorities;
}
