package io.spring.enrollmentsystem.feature.section;

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
 * (Section) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin/sections")
@Tag(name = "section-admin", description = "section API for admin")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class AdminSectionController {

    private final SectionService sectionService;

    @GetMapping("/{sectionId}")
    @Operation(summary = "Find section by id", tags = "section-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<SectionDto> getSection(@PathVariable UUID sectionId) {
        return ResponseEntity
                .ok()
                .body(sectionService.getSectionDtoById(sectionId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of section by predicate", tags = "section-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<List<SectionDto>> getAllSectionByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {
        return ResponseEntity
                .ok()
                .body(sectionService.getAllSectionDtoByPredicate(parameters));
    }

    @GetMapping("/page")
    @Operation(summary = "Find all instances of section as pages by predicate", tags = "section-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<Page<SectionDto>> getSectionPageableByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters,
            @ParameterObject Pageable pageable) {
        return ResponseEntity
                .ok()
                .body(sectionService.getSectionDtoPageableByPredicate(parameters, pageable));
    }

    @GetMapping("/slice")
    @Operation(summary = "Find all instances of section as slices by predicate", tags = "section-admin")
    @JsonView(AdminView.AdminVeryHighWithId.class)
    public ResponseEntity<Slice<SectionDto>> getSectionSliceByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters,
            @ParameterObject Pageable pageable) {
        return ResponseEntity
                .ok()
                .body(sectionService.getSectionDtoSliceByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new section", tags = "section-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<SectionDto> createSection(@RequestBody
                                                    @Validated({ValidationGroup.onCreate.class, Default.class})
                                                    @JsonView(AdminView.AdminCreate.class)
                                                            SectionDto sectionDto) {
        SectionDto response = sectionService.createSection(sectionDto);
        String sectionId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{sectionId}")
                .buildAndExpand(sectionId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{sectionId}")
    @Operation(summary = "Update a section by id", tags = "section-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<SectionDto> updateSection(@PathVariable UUID sectionId,
                                                    @RequestBody @Valid
                                                    @JsonView(AdminView.AdminUpdate.class)
                                                            SectionDto sectionDto) {
        SectionDto response = sectionService.updateSection(sectionId, sectionDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{sectionId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a section by id", tags = "section-admin")
    @JsonView(AdminView.AdminHighWithId.class)
    public ResponseEntity<SectionDto> patchSection(@PathVariable UUID sectionId,
                                                   @RequestBody JsonMergePatch mergePatchDocument) {
        SectionDto response = sectionService.patchSection(sectionId, mergePatchDocument, AdminView.AdminUpdate.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{sectionId}")
    @Operation(summary = "Delete a section by id", tags = "section-admin")
    public ResponseEntity<Void> deleteSection(@PathVariable UUID sectionId) {
        sectionService.deleteById(sectionId);
        return ResponseEntity.noContent().build();
    }

}