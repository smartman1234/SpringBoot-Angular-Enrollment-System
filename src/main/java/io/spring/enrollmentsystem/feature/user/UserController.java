package io.spring.enrollmentsystem.feature.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@RestController @RequestMapping("/api/v1/users")
@Tag(name = "user", description = "user API")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    @Operation(summary = "Find user by id", tags = "user")
    @PreAuthorize("@webSecurity.hasUserId(#userId)")
    @JsonView(BaseView.Medium.class)
    public ResponseEntity<UserDto> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok().body(userService.getUserDtoById(userId));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update a user by id", tags = "user")
    @PreAuthorize("@webSecurity.hasUserId(#userId)")
    @JsonView(BaseView.Medium.class)
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID userId,
                                              @JsonView(BaseView.Update.class)
                                              @RequestBody @Valid UserDto userDto) {
        UserDto response = userService.updateUser(userId, userDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{userId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a a user by id", tags = "user")
    @PreAuthorize("@webSecurity.hasUserId(#userId)")
    @JsonView(BaseView.Medium.class)
    public ResponseEntity<UserDto> patchUser(@PathVariable UUID userId,
                                             @RequestBody JsonMergePatch mergePatchDocument) {
        UserDto response = userService.patchUser(userId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping(path = "/{userId}/change-password")
    @Operation(summary = "Change a user's password", tags = "user")
    @PreAuthorize("@webSecurity.hasUserId(#userId)")
    public ResponseEntity<Void> changeUserPassword(@PathVariable UUID userId,
                                                   @RequestBody @NotNull PasswordChangeDto passwordChangeDto) {
        userService.changeUserPassword(userId, passwordChangeDto);
        return ResponseEntity.ok().build();
    }
}
