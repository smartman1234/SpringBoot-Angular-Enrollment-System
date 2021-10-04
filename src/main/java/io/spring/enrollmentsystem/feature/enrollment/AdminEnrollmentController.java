package io.spring.enrollmentsystem.feature.enrollment;

import com.fasterxml.jackson.annotation.JsonView;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.groups.Default;
import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * (Enrollment) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin")
@Tag(name = "enrollment-admin", description = "enrollment API")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class AdminEnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/students/{studentId}/sections/{sectionId}")
    @Operation(summary = "Find an enrollment by student id and section id", tags = "enrollment-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<EnrollmentDto> getEnrollment(@PathVariable UUID studentId,
                                                       @PathVariable UUID sectionId) {
        EnrollmentDto response = enrollmentService.getEnrollmentDtoByCompositeId(studentId, sectionId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/enrollments")
    @Operation(summary = "Find all instances of enrollment by predicate", tags = "enrollment-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<List<EnrollmentDto>> getAllEnrollmentByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(enrollmentService.getAllEnrollmentDtoByPredicate(parameters));
    }

    @GetMapping("/enrollments/page")
    @Operation(summary = "Find all instances of enrollment as pages by predicate", tags = "enrollment-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<Page<EnrollmentDto>> getEnrollmentPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(enrollmentService.getEnrollmentDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("/students/{studentId}/sections")
    @Operation(summary = "Add a new enrollment to cart by student id", tags = "enrollment-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<EnrollmentDto> addEnrollmentToCart(@PathVariable UUID studentId,
                                                             @RequestBody
                                                             @Validated({ValidationGroup.onCreate.class, Default.class})
                                                             @JsonView(BaseView.Create.class)
                                                                     EnrollmentDto enrollmentDto) {
        EnrollmentDto response = enrollmentService.addEnrollmentToCart(enrollmentDto);
        String sectionId = String.valueOf(response.getSectionId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{studentId}/sections/{sectionId}")
                .buildAndExpand(studentId, sectionId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PatchMapping(path = "/students/{studentId}/sections/{sectionId}/enrollment-status")
    @Operation(summary = "Enroll from shopping cart or waiting list by student id and section id", tags = "enrollment-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<EnrollmentDto> enrollFromCart(@PathVariable UUID studentId,
                                                        @PathVariable UUID sectionId,
                                                        @RequestBody(required = false)
                                                                AccessCodeDto accessCodeDto) {

        EnrollmentDto response = enrollmentService.enrollFromCartOrWaitingList(studentId,
                                                                               sectionId,
                                                                               accessCodeDto.getAccessCode());
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/students/{studentId}/sections/{sectionId}")
    @Operation(summary = "Drop an enrollment by student id and section id", tags = "enrollment-admin")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable UUID studentId,
                                                 @PathVariable UUID sectionId) {
        enrollmentService.deleteByCompositeId(studentId, sectionId);
        return ResponseEntity.noContent().build();
    }
}