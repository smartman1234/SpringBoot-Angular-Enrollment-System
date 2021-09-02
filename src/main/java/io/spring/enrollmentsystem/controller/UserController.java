package io.spring.enrollmentsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.dto.PasswordChangeDto;
import io.spring.enrollmentsystem.dto.UserDto;
import io.spring.enrollmentsystem.service.UserService;
import io.spring.enrollmentsystem.validator.ValidationGroup;
import io.spring.enrollmentsystem.view.AdminView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.util.UUID;

@RestController @RequestMapping("/api/v1/admin/users")
@Tag(name = "user", description = "user API")
@PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    @Operation(summary = "Find user by id", tags = "user")
    @JsonView(AdminView.MediumWithId.class)
    public ResponseEntity<UserDto> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok().body(userService.getUserDtoById(userId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of user as pages", tags = "user")
    @JsonView(AdminView.MediumWithId.class)
    public ResponseEntity<Page<UserDto>> getUserPageable(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok().body(userService.getUserDtoPageable(pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new user", tags = "user")
    @JsonView(AdminView.MediumWithId.class)
    public ResponseEntity<UserDto> createUser(@JsonView(AdminView.Create.class)
                                              @Validated(ValidationGroup.onCreate.class)
                                              @RequestBody UserDto userDto) {
        UserDto response = userService.createUser(userDto);
        String userId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{userId}")
                .buildAndExpand(userId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update a user by id", tags = "user")
    @JsonView(AdminView.MediumWithId.class)
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID userId,
                                              @JsonView(AdminView.Update.class)
                                              @RequestBody @Valid UserDto userDto) {
        UserDto response = userService.updateUser(userId, userDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{userId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a a user by id", tags = "user")
    @JsonView(AdminView.MediumWithId.class)
    public ResponseEntity<UserDto> patchUser(@PathVariable UUID userId,
                                             @RequestBody JsonMergePatch mergePatchDocument) {
        UserDto response = userService.patchUser(userId, mergePatchDocument, AdminView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping(path = "/{userId}/change-password")
    @Operation(summary = "Change a user's password", tags = "user")
    public ResponseEntity<Void> changeUserPassword(@PathVariable UUID userId,
                                                   @RequestBody @NotNull PasswordChangeDto passwordChangeDto) {
        userService.changeUserPassword(userId, passwordChangeDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete a user by id", tags = "user")
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId) {
        userService.deleteById(userId);
        return ResponseEntity.noContent().build();
    }
}
