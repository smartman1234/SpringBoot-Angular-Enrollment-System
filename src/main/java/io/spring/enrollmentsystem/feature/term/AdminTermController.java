package io.spring.enrollmentsystem.feature.term;

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
 * (Term) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin/terms")
@Tag(name = "term-admin", description = "term API for admin")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class AdminTermController {

    private final TermService termService;

    @GetMapping("/{termId}")
    @Operation(summary = "Find term by id", tags = "term-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<TermDto> getTerm(@PathVariable UUID termId) {
        return ResponseEntity
                .ok()
                .body(termService.getTermDtoById(termId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of term by predicate", tags = "term-admin")
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<List<TermDto>> getAllTermByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(termService.getAllTermDtoByPredicate(parameters));
    }

    @GetMapping("/page")
    @Operation(summary = "Find all instances of term as pages by predicate", tags = "term-admin")
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Page<TermDto>> getTermPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(termService.getTermDtoPageableByPredicate(parameters, pageable));
    }

    @GetMapping("/slice")
    @Operation(summary = "Find all instances of term as slices by predicate", tags = "term-admin")
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<Slice<TermDto>> getTermSliceByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(termService.getTermDtoSliceByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new term", tags = "term-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<TermDto> createTerm(@RequestBody
                                              @Validated({ValidationGroup.onCreate.class, Default.class})
                                              @JsonView(BaseView.Create.class)
                                                      TermDto termDto) {
        TermDto response = termService.createTerm(termDto);
        String termId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{termId}")
                .buildAndExpand(termId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{termId}")
    @Operation(summary = "Update a term by id", tags = "term-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<TermDto> updateTerm(@PathVariable UUID termId,
                                              @RequestBody @Valid
                                              @JsonView(BaseView.Update.class)
                                                      TermDto termDto) {
        TermDto response = termService.updateTerm(termId, termDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{termId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a term by id", tags = "term-admin")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<TermDto> patchTerm(@PathVariable UUID termId,
                                             @RequestBody JsonMergePatch mergePatchDocument) {
        TermDto response = termService.patchTerm(termId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{termId}")
    @Operation(summary = "Delete a term by id", tags = "term-admin")
    public ResponseEntity<Void> deleteTerm(@PathVariable UUID termId) {
        termService.deleteById(termId);
        return ResponseEntity.noContent().build();
    }

}
