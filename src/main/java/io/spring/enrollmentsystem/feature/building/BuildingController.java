package io.spring.enrollmentsystem.feature.building;

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
 * (Building) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@RestController @RequestMapping("/api/v1/admin/buildings")
@Tag(name = "building", description = "building API")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class BuildingController {

    private final BuildingService buildingService;

    @GetMapping("/{buildingId}")
    @Operation(summary = "Find building by id", tags = "building")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<BuildingDto> getBuilding(@PathVariable UUID buildingId) {
        return ResponseEntity
                .ok()
                .body(buildingService.getBuildingDtoById(buildingId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of building as pages by predicate", tags = "building")
    @JsonView(BaseView.MediumWithId.class)
    @Parameter(in = ParameterIn.QUERY, name = "parameters", schema = @Schema(type = "object"), example = "{}")
    public ResponseEntity<Page<BuildingDto>> getBuildingPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(buildingService.getBuildingDtoPageableByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new building", tags = "building")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<BuildingDto> createBuilding(@RequestBody
                                                      @Validated({ValidationGroup.onCreate.class, Default.class})
                                                      @JsonView(BaseView.Create.class)
                                                              BuildingDto buildingDto) {
        BuildingDto response = buildingService.createBuilding(buildingDto);
        String buildingId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{buildingId}")
                .buildAndExpand(buildingId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{buildingId}")
    @Operation(summary = "Update a building by id", tags = "building")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<BuildingDto> updateBuilding(@PathVariable UUID buildingId,
                                                      @RequestBody @Valid
                                                      @JsonView(BaseView.Update.class)
                                                              BuildingDto buildingDto) {
        BuildingDto response = buildingService.updateBuilding(buildingId, buildingDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{buildingId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a building by id", tags = "building")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<BuildingDto> patchBuilding(@PathVariable UUID buildingId,
                                                     @RequestBody JsonMergePatch mergePatchDocument) {
        BuildingDto response = buildingService.patchBuilding(buildingId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{buildingId}")
    @Operation(summary = "Delete a building by id", tags = "building")
    public ResponseEntity<Void> deleteBuilding(@PathVariable UUID buildingId) {
        buildingService.deleteById(buildingId);
        return ResponseEntity.noContent().build();
    }

}