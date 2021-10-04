package io.spring.enrollmentsystem.feature.student;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController @RequestMapping("/api/v1/students")
@Tag(name = "student", description = "student API")
@Validated
@RequiredArgsConstructor @Slf4j
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/{studentId}")
    @Operation(summary = "Find student by id", tags = "student")
    @PreAuthorize("hasRole(@Role.ADMIN) or @webSecurity.hasStudentId(#studentId)")
    @JsonView(BaseView.VeryHigh.class)
    public ResponseEntity<StudentDto> getStudent(@PathVariable UUID studentId) {
        return ResponseEntity
                .ok()
                .body(studentService.getStudentDtoById(studentId));
    }

//    @PutMapping("/{studentId}")
//    @Operation(summary = "Update a student by id", tags = "student")
//    @JsonView(BaseView.AdminHigh.class)
//    public ResponseEntity<StudentDto> updateStudent(@PathVariable UUID studentId,
//                                                    @RequestBody @Valid
//                                                    @JsonView(BaseView.AdminUpdate.class)
//                                                            StudentDto studentDto) {
//        StudentDto response = studentService.updateStudent(studentId, studentDto);
//        return ResponseEntity.ok().body(response);
//    }

//    @PatchMapping(path = "/{studentId}", consumes = "application/merge-patch+json")
//    @Operation(summary = "Patch a student by id", tags = "student")
//    @JsonView(BaseView.AdminHigh.class)
//    public ResponseEntity<StudentDto> patchStudent(@PathVariable UUID studentId,
//                                                   @RequestBody JsonMergePatch mergePatchDocument) {
//        StudentDto response = studentService.patchStudent(studentId, mergePatchDocument, BaseView.AdminUpdate.class);
//        return ResponseEntity.ok().body(response);
//    }

}
