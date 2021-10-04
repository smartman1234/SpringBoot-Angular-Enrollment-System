package io.spring.enrollmentsystem.feature.student;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.groups.Default;
import java.net.URI;
import java.util.UUID;

/**
 * (Student) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin/students")
@Tag(name = "student-admin", description = "student API for admin")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class AdminStudentController {

    private final StudentService studentService;

    @GetMapping("/{studentId}")
    @Operation(summary = "Find student by id", tags = "student-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<StudentDto> getStudent(@PathVariable UUID studentId) {
        return ResponseEntity
                .ok()
                .body(studentService.getStudentDtoById(studentId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of student as pages by predicate", tags = "student-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<Page<StudentDto>> getStudentPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(studentService.getStudentDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new student", tags = "student-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<StudentDto> createStudent(@RequestBody
                                                    @Validated({ValidationGroup.onCreate.class, Default.class})
                                                    @JsonView(AdminView.AdminCreate.class)
                                                            StudentDto studentDto) {
        StudentDto response = studentService.createStudent(studentDto);
        String studentId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{studentId}")
                .buildAndExpand(studentId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{studentId}")
    @Operation(summary = "Update a student by id", tags = "student-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<StudentDto> updateStudent(@PathVariable UUID studentId,
                                                    @RequestBody @Valid
                                                    @JsonView(AdminView.AdminUpdate.class)
                                                            StudentDto studentDto) {
        StudentDto response = studentService.updateStudent(studentId, studentDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{studentId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a student by id", tags = "student-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<StudentDto> patchStudent(@PathVariable UUID studentId,
                                                   @RequestBody JsonMergePatch mergePatchDocument) {
        StudentDto response = studentService.patchStudent(studentId, mergePatchDocument, AdminView.AdminUpdate.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{studentId}")
    @Operation(summary = "Delete a student by id", tags = "student-admin")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID studentId) {
        studentService.deleteById(studentId);
        return ResponseEntity.noContent().build();
    }

}