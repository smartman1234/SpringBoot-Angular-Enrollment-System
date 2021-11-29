package io.spring.enrollmentsystem.feature.instructor;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
import javax.validation.groups.Default;
import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * (Instructor) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin/instructors")
@Tag(name = "instructor-admin", description = "instructor API for admin")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class AdminInstructorController {

    private final InstructorService instructorService;

    @GetMapping("/{instructorId}")
    @Operation(summary = "Find instructor by id", tags = "instructor-admin")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<InstructorDto> getInstructor(@PathVariable UUID instructorId) {
        return ResponseEntity
                .ok()
                .body(instructorService.getInstructorDtoById(instructorId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of instructor by predicate", tags = "instructor-admin")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<List<InstructorDto>> getAllInstructorByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(instructorService.getAllInstructorDtoByPredicate(parameters));
    }

    @GetMapping("/page")
    @Operation(summary = "Find all instances of instructor as pages by predicate", tags = "instructor-admin")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<Page<InstructorDto>> getInstructorPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(instructorService.getInstructorDtoPageableByPredicate(parameters, pageable));
    }

    @GetMapping("/slice")
    @Operation(summary = "Find all instances of instructor as slices by predicate", tags = "instructor-admin")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<Slice<InstructorDto>> getInstructorSliceByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(instructorService.getInstructorDtoSliceByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new instructor", tags = "instructor-admin")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<InstructorDto> createInstructor(@RequestBody
                                                          @Validated({ValidationGroup.onCreate.class, Default.class})
                                                          @JsonView(AdminView.AdminCreate.class)
                                                                  InstructorDto instructorDto) {
        InstructorDto response = instructorService.createInstructor(instructorDto);
        String instructorId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{instructorId}")
                .buildAndExpand(instructorId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{instructorId}")
    @Operation(summary = "Update a instructor by id", tags = "instructor-admin")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<InstructorDto> updateInstructor(@PathVariable UUID instructorId,
                                                          @RequestBody @Valid
                                                          @JsonView(AdminView.AdminUpdate.class)
                                                                  InstructorDto instructorDto) {
        InstructorDto response = instructorService.updateInstructor(instructorId, instructorDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{instructorId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a instructor by id", tags = "instructor-admin")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<InstructorDto> patchInstructor(@PathVariable UUID instructorId,
                                                         @RequestBody JsonMergePatch mergePatchDocument) {
        InstructorDto response = instructorService.patchInstructor(instructorId, mergePatchDocument,
                                                                   AdminView.AdminUpdate.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{instructorId}")
    @Operation(summary = "Delete a instructor by id", tags = "instructor-admin")
    public ResponseEntity<Void> deleteInstructor(@PathVariable UUID instructorId) {
        instructorService.deleteById(instructorId);
        return ResponseEntity.noContent().build();
    }

}