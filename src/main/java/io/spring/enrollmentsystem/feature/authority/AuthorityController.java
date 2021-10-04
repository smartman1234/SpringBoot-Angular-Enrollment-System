package io.spring.enrollmentsystem.feature.authority;

import com.fasterxml.jackson.annotation.JsonView;
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
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.UUID;

@Service @RequestMapping("/api/v1/admin/authorities")
@Tag(name = "authority", description = "authority API")
@PreAuthorize("hasRole(@Role.ADMIN)")
@Slf4j @RequiredArgsConstructor
public class AuthorityController {

    private final AuthorityService authorityService;

    @GetMapping("/{authorityId}")
    @Operation(summary = "Find authority by id", tags = "authority")
    public ResponseEntity<AuthorityDto> getAuthority(@PathVariable UUID authorityId) {
        return ResponseEntity
                .ok()
                .body(authorityService.getAuthorityDtoById(authorityId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of authority as pages by predicate", tags = "authority")
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    public ResponseEntity<Page<AuthorityDto>> getAuthorityPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(authorityService.getAuthorityDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new authority", tags = "authority")
    public ResponseEntity<AuthorityDto> createAuthority(@JsonView(BaseView.Create.class)
                                                        @RequestBody @Valid AuthorityDto authorityDto) {
        AuthorityDto response = authorityService.createAuthority(authorityDto);
        String authorityId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{authorityId}")
                .buildAndExpand(authorityId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{authorityId}")
    @Operation(summary = "Update an authority by id", tags = "authority")
    public ResponseEntity<AuthorityDto> updateAuthority(@PathVariable UUID authorityId,
                                                        @JsonView(BaseView.Update.class)
                                                        @RequestBody @Valid AuthorityDto authorityDto) {
        AuthorityDto response = authorityService.updateAuthority(authorityId, authorityDto);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{authorityId}")
    @Operation(summary = "Delete an authority by id", tags = "authority")
    public ResponseEntity<Void> deleteAuthority(@PathVariable UUID authorityId) {
        authorityService.deleteById(authorityId);
        return ResponseEntity.noContent().build();
    }
}
