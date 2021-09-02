package io.spring.enrollmentsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.dto.AuthorityDto;
import io.spring.enrollmentsystem.service.AuthorityService;
import io.spring.enrollmentsystem.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.UUID;

@Service @RequestMapping("/api/v1/authorities")
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
    @Operation(summary = "Find all instances of authority as pages", tags = "authority")
    public ResponseEntity<Page<AuthorityDto>> getAuthorityPageable(@ParameterObject Pageable pageable) {
        return ResponseEntity
                .ok()
                .body(authorityService.getAuthorityDtoPageable(pageable));
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
