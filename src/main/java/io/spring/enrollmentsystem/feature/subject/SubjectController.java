package io.spring.enrollmentsystem.feature.subject;

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
 * (Subject) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin/subjects")
@Tag(name = "subject", description = "subject API")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping("/{subjectId}")
    @Operation(summary = "Find subject by id", tags = "subject")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<SubjectDto> getSubject(@PathVariable UUID subjectId) {
        return ResponseEntity
                .ok()
                .body(subjectService.getSubjectDtoById(subjectId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of subject as pages by predicate", tags = "subject")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Page<SubjectDto>> getSubjectPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(subjectService.getSubjectDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new subject", tags = "subject")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<SubjectDto> createSubject(@RequestBody
                                                    @Validated({ValidationGroup.onCreate.class, Default.class})
                                                    @JsonView(BaseView.Create.class)
                                                            SubjectDto subjectDto) {
        SubjectDto response = subjectService.createSubject(subjectDto);
        String subjectId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{subjectId}")
                .buildAndExpand(subjectId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{subjectId}")
    @Operation(summary = "Update a subject by id", tags = "subject")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<SubjectDto> updateSubject(@PathVariable UUID subjectId,
                                                    @RequestBody @Valid
                                                    @JsonView(BaseView.Update.class)
                                                            SubjectDto subjectDto) {
        SubjectDto response = subjectService.updateSubject(subjectId, subjectDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{subjectId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a subject by id", tags = "subject")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<SubjectDto> patchSubject(@PathVariable UUID subjectId,
                                                   @RequestBody JsonMergePatch mergePatchDocument) {
        SubjectDto response = subjectService.patchSubject(subjectId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{subjectId}")
    @Operation(summary = "Delete a subject by id", tags = "subject")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID subjectId) {
        subjectService.deleteById(subjectId);
        return ResponseEntity.noContent().build();
    }

}