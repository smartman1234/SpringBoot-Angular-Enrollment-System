package io.spring.enrollmentsystem.feature.section;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.course.Course_;
import io.spring.enrollmentsystem.feature.subject.Subject_;
import io.spring.enrollmentsystem.feature.term.Term_;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.ValidationException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

@RestController
@Tag(name = "section", description = "section API")
@PreAuthorize("isAuthenticated()")
@Validated
@RequiredArgsConstructor @Slf4j
public class SectionController {

    private static final String FILTER_URL = "/api/v1/sections";
    private static final String FILTER_PAGE_URL = "/api/v1/sections/page";
    private static final String FILTER_SLICE_URL = "/api/v1/sections/slice";
    public static final Set<String> FILTER_URLS = new HashSet<>(Set.of(FILTER_URL, FILTER_PAGE_URL, FILTER_SLICE_URL));

    private final SectionService sectionService;

    @GetMapping("/api/v1/sections/{sectionId}")
    @Operation(summary = "Find section by id", tags = "section")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<SectionDto> getSection(@PathVariable UUID sectionId) {
        return ResponseEntity
                .ok()
                .body(sectionService.getSectionDtoById(sectionId));
    }


    @GetMapping(FILTER_URL)
    @Operation(summary = "Find all instances of section by predicate", tags = "section")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<List<SectionDto>> getAllSectionDtoByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        validateParameters(parameters);

        return ResponseEntity
                .ok()
                .body(sectionService.getAllSectionDtoByPredicate(parameters));
    }

    @GetMapping(FILTER_PAGE_URL)
    @Operation(summary = "Find all instances of section as pages by predicate", tags = "section")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<Page<SectionDto>> getSectionDtoPageableByPredicate(
            @ParameterObject @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {
        if (pageable.getSort().stream().count() == 0) {
            pageable = PageRequest.of(pageable.getPageNumber(),
                                      pageable.getPageSize(),
                                      Sort.by(Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_CODE,
                                              Section_.SECTION_NUMBER));
        }
        validateParameters(parameters);

        return ResponseEntity
                .ok()
                .body(sectionService.getSectionDtoPageableByPredicate(parameters, pageable));
    }

    @GetMapping(FILTER_SLICE_URL)
    @Operation(summary = "Find all instances of section as slices by predicate", tags = "section")
    @JsonView(BaseView.VeryHighWithId.class)
    public ResponseEntity<Slice<SectionDto>> getSectionDtoSliceByPredicate(
            @ParameterObject @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {
        if (pageable.getSort().stream().count() == 0) {
            pageable = PageRequest.of(pageable.getPageNumber(),
                                      pageable.getPageSize(),
                                      Sort.by(Section_.COURSE + KEY_SEPARATOR + Course_.COURSE_CODE,
                                              Section_.SECTION_NUMBER));
        }
        validateParameters(parameters);

        return ResponseEntity
                .ok()
                .body(sectionService.getSectionDtoSliceByPredicate(parameters, pageable));
    }

    private void validateParameters(MultiValueMap<String, String> parameters) {
        if (!parameters.containsKey(Section_.TERM + "." + Term_.TERM_NAME)) {
            throw new ValidationException("Parameter '" + Section_.TERM + "." + Term_.TERM_NAME + " is required!");
        }
        if (!parameters.containsKey(Section_.COURSE + "." + Course_.SUBJECT + "." + Subject_.SUBJECT_ACRONYM)) {
            throw new ValidationException("Parameter '" + Section_.COURSE + "." + Course_.SUBJECT
                                                  + "." + Subject_.SUBJECT_ACRONYM + " is required!");
        }
    }
}
