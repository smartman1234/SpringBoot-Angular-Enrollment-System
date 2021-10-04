package io.spring.enrollmentsystem.feature.department;

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
 * (Department) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@RestController @RequestMapping("/api/v1/admin/departments")
@Tag(name = "department", description = "department API")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/{departmentId}")
    @Operation(summary = "Find department by id", tags = "department")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<DepartmentDto> getDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity
                .ok()
                .body(departmentService.getDepartmentDtoById(departmentId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of department as pages by predicate", tags = "department")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Page<DepartmentDto>> getDepartmentPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(departmentService.getDepartmentDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new department", tags = "department")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody
                                                          @Validated({ValidationGroup.onCreate.class, Default.class})
                                                          @JsonView(BaseView.Create.class)
                                                                  DepartmentDto departmentDto) {
        DepartmentDto response = departmentService.createDepartment(departmentDto);
        String departmentId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{departmentId}")
                .buildAndExpand(departmentId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{departmentId}")
    @Operation(summary = "Update a department by id", tags = "department")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable UUID departmentId,
                                                          @RequestBody @Valid
                                                          @JsonView(BaseView.Update.class)
                                                                  DepartmentDto departmentDto) {
        DepartmentDto response = departmentService.updateDepartment(departmentId, departmentDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{departmentId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a department by id", tags = "department")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<DepartmentDto> patchDepartment(@PathVariable UUID departmentId,
                                                         @RequestBody JsonMergePatch mergePatchDocument) {
        DepartmentDto response = departmentService.patchDepartment(departmentId, mergePatchDocument,
                                                                   BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{departmentId}")
    @Operation(summary = "Delete a department by id", tags = "department")
    public ResponseEntity<Void> deleteDepartment(@PathVariable UUID departmentId) {
        departmentService.deleteById(departmentId);
        return ResponseEntity.noContent().build();
    }

}