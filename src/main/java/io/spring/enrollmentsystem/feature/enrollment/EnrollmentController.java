package io.spring.enrollmentsystem.feature.enrollment;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.student.Student_;
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

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

@RestController @RequestMapping("/api/v1")
@Tag(name = "enrollment", description = "enrollment API")
@Validated
@RequiredArgsConstructor @Slf4j
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/students/{studentId}/sections/{sectionId}")
    @Operation(summary = "Find an enrollment by student id and section id", tags = "enrollment")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<EnrollmentDto> getEnrollment(@PathVariable UUID studentId,
                                                       @PathVariable UUID sectionId) {
        EnrollmentDto response = enrollmentService.getEnrollmentDtoByCompositeId(studentId, sectionId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/students/{studentId}/sections")
    @Operation(summary = "Find all instances of enrollment by student id", tags = "enrollment")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<List<EnrollmentDto>> getAllEnrollment(
            @PathVariable UUID studentId,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        parameters.add(Enrollment_.STUDENT + KEY_SEPARATOR + Student_.ID, studentId.toString());
        List<EnrollmentDto> responses = enrollmentService.getAllEnrollmentDtoByPredicate(parameters);
        return ResponseEntity.ok().body(responses);
    }

    @GetMapping("/students/{studentId}/sections/page")
    @Operation(summary = "Find all instances of enrollment as pages by student id", tags = "enrollment")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<Page<EnrollmentDto>> getEnrollmentPageable(
            @PathVariable UUID studentId,
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        parameters.add(Enrollment_.STUDENT + KEY_SEPARATOR + Student_.ID, studentId.toString());
        Page<EnrollmentDto> response = enrollmentService.getEnrollmentDtoPageableByPredicate(parameters, pageable);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/students/{studentId}/sections")
    @Operation(summary = "Add a new enrollment to cart by student id", tags = "enrollment")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    @JsonView(BaseView.HighWithId.class)
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
    @Operation(summary = "Enroll from shopping cart or waiting list  by student id and section id", tags = "enrollment")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    @JsonView(BaseView.HighWithId.class)
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
    @Operation(summary = "Drop an enrollment by student id and section id", tags = "enrollment")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable UUID studentId,
                                                 @PathVariable UUID sectionId) {
        enrollmentService.deleteByCompositeId(studentId, sectionId);
        return ResponseEntity.noContent().build();
    }
}
