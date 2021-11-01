package io.spring.enrollmentsystem.feature.course;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
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
 * (Course) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@RestController @RequestMapping("/api/v1/admin/courses")
@Tag(name = "course-admin", description = "course API for admin")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class AdminCourseController {

    private final CourseService courseService;

    @GetMapping("/{courseId}")
    @Operation(summary = "Find course by id", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CourseDto> getCourse(@PathVariable UUID courseId) {
        return ResponseEntity
                .ok()
                .body(courseService.getCourseDtoById(courseId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of course by predicate", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<List<CourseDto>> getAllCourseByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(courseService.getAllCourseDtoByPredicate(parameters));
    }

    @GetMapping("/page")
    @Operation(summary = "Find all instances of course as pages by predicate", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Page<CourseDto>> getCoursePageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(courseService.getCourseDtoPageableByPredicate(parameters, pageable));
    }

    @GetMapping("/slice")
    @Operation(summary = "Find all instances of course as slices by predicate", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Slice<CourseDto>> getCourseSliceByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(courseService.getCourseDtoSliceByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new course", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CourseDto> createCourse(@RequestBody
                                                  @Validated({ValidationGroup.onCreate.class, Default.class})
                                                  @JsonView(BaseView.Create.class)
                                                          CourseDto courseDto) {
        CourseDto response = courseService.createCourse(courseDto);
        String courseId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{courseId}")
                .buildAndExpand(courseId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{courseId}")
    @Operation(summary = "Update a course by id", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CourseDto> updateCourse(@PathVariable UUID courseId,
                                                  @RequestBody @Valid
                                                  @JsonView(BaseView.Update.class)
                                                          CourseDto courseDto) {
        CourseDto response = courseService.updateCourse(courseId, courseDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{courseId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a course by id", tags = "course-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CourseDto> patchCourse(@PathVariable UUID courseId,
                                                 @RequestBody JsonMergePatch mergePatchDocument) {
        CourseDto response = courseService.patchCourse(courseId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Delete a course by id", tags = "course-admin")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID courseId) {
        courseService.deleteById(courseId);
        return ResponseEntity.noContent().build();
    }

}