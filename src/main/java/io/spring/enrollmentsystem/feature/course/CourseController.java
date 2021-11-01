package io.spring.enrollmentsystem.feature.course;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController @RequestMapping("/api/v1/courses")
@Tag(name = "course", description = "course API")
@Validated
@RequiredArgsConstructor @Slf4j
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/{courseId}")
    @Operation(summary = "Find course by id", tags = "course")
    @JsonView(BaseView.Low.class)
    public ResponseEntity<CourseDto> getCourse(@PathVariable UUID courseId) {
        return ResponseEntity
                .ok()
                .body(courseService.getCourseDtoById(courseId));
    }
}
