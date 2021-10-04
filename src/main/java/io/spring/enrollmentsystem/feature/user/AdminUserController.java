package io.spring.enrollmentsystem.feature.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.groups.Default;
import java.net.URI;
import java.util.UUID;

@RestController @RequestMapping("/api/v1/admin/users")
@Tag(name = "user-admin", description = "user API for admin")
@PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    @Operation(summary = "Find user by id", tags = "user-admin")
    @JsonView(AdminView.AdminMediumWithId.class)
    public ResponseEntity<UserDto> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok().body(userService.getUserDtoById(userId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of user as pages", tags = "user-admin")
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    @JsonView(AdminView.AdminMediumWithId.class)
    public ResponseEntity<Page<UserDto>> getUserPageable(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {
        return ResponseEntity.ok().body(userService.getUserDtoPageable(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new user", tags = "user-admin")
    @JsonView(AdminView.AdminMediumWithId.class)
    public ResponseEntity<UserDto> createUser(@JsonView(AdminView.AdminCreate.class)
                                              @Validated({ValidationGroup.onCreate.class, Default.class})
                                              @RequestBody UserDto userDto) {
        UserDto response = userService.createUser(userDto);
        String userId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{userId}")
                .buildAndExpand(userId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update a user by id", tags = "user-admin")
    @JsonView(AdminView.AdminMediumWithId.class)
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID userId,
                                              @JsonView(AdminView.AdminUpdate.class)
                                              @RequestBody @Valid UserDto userDto) {
        UserDto response = userService.updateUser(userId, userDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{userId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a a user by id", tags = "user-admin")
    @JsonView(AdminView.AdminMediumWithId.class)
    public ResponseEntity<UserDto> patchUser(@PathVariable UUID userId,
                                             @RequestBody JsonMergePatch mergePatchDocument) {
        UserDto response = userService.patchUser(userId, mergePatchDocument, AdminView.AdminUpdate.class);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping(path = "/{userId}/change-password")
    @Operation(summary = "Change a user's password", tags = "user-admin")
    public ResponseEntity<Void> changeUserPassword(@PathVariable UUID userId,
                                                   @RequestBody @NotNull PasswordChangeDto passwordChangeDto) {
        userService.changeUserPassword(userId, passwordChangeDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete a user by id", tags = "user-admin")
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId) {
        userService.deleteById(userId);
        return ResponseEntity.noContent().build();
    }
}
