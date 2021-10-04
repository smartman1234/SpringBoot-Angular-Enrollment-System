package io.spring.enrollmentsystem.feature.college;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
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
 * (College) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@RestController @RequestMapping("/api/v1/admin/colleges")
@Tag(name = "college", description = "college API")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class CollegeController {

    private final CollegeService collegeService;

    @GetMapping("/{collegeId}")
    @Operation(summary = "Find college by id", tags = "college")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CollegeDto> getCollege(@PathVariable UUID collegeId) {
        return ResponseEntity
                .ok()
                .body(collegeService.getCollegeDtoById(collegeId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of college as pages by predicate", tags = "college")
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Page<CollegeDto>> getCollegePageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(collegeService.getCollegeDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new college", tags = "college")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CollegeDto> createCollege(@RequestBody
                                                    @Validated({ValidationGroup.onCreate.class, Default.class})
                                                    @JsonView(BaseView.Create.class)
                                                            CollegeDto collegeDto) {
        CollegeDto response = collegeService.createCollege(collegeDto);
        String collegeId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{collegeId}")
                .buildAndExpand(collegeId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{collegeId}")
    @Operation(summary = "Update a college by id", tags = "college")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CollegeDto> updateCollege(@PathVariable UUID collegeId,
                                                    @RequestBody @Valid
                                                    @JsonView(BaseView.Update.class)
                                                            CollegeDto collegeDto) {
        CollegeDto response = collegeService.updateCollege(collegeId, collegeDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{collegeId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a college by id", tags = "college")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<CollegeDto> patchCollege(@PathVariable UUID collegeId,
                                                   @RequestBody JsonMergePatch mergePatchDocument) {
        CollegeDto response = collegeService.patchCollege(collegeId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{collegeId}")
    @Operation(summary = "Delete a college by id", tags = "college")
    public ResponseEntity<Void> deleteCollege(@PathVariable UUID collegeId) {
        collegeService.deleteById(collegeId);
        return ResponseEntity.noContent().build();
    }

}