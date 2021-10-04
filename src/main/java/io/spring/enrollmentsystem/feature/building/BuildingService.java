package io.spring.enrollmentsystem.feature.building;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import javax.validation.ValidationException;
import java.util.UUID;

/**
 * (Building) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final BuildingMapper buildingMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Building getBuildingById(UUID buildingId) {
        return buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException(Building.class, buildingId));
    }

    @Transactional(readOnly = true)
    public BuildingDto getBuildingDtoById(UUID buildingId) {
        return buildingMapper.toBuildingDto(getBuildingById(buildingId));
    }

    @Transactional(readOnly = true)
    public Page<BuildingDto> getBuildingDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                               Pageable pageable) {
        return buildingRepository
                .findAll(Building.class, specificationService.getSpecifications(parameters), pageable)
                .map(buildingMapper::toBuildingDto);
    }

    @Transactional
    public BuildingDto createBuilding(BuildingDto buildingDto) {
        validateBuildingDto(buildingDto, null);
        Building transientBuilding = buildingMapper.toBuilding(buildingDto);
        return buildingMapper.toBuildingDto(buildingRepository.save(transientBuilding));
    }

    @Transactional
    public BuildingDto updateBuilding(UUID buildingId, BuildingDto buildingDto) {
        Building currentBuilding = getBuildingById(buildingId);

        validateBuildingDto(buildingDto, currentBuilding);
        return buildingMapper.toBuildingDto(buildingMapper.toExistingBuilding(buildingDto, currentBuilding));
    }

    @Transactional
    public BuildingDto patchBuilding(UUID buildingId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Building currentBuilding = getBuildingById(buildingId);
        BuildingDto currentBuildingDto = buildingMapper.toBuildingDto(currentBuilding);

        BuildingDto patchedBuildingDto = patchService.mergePatch(mergePatchDocument,
                                                                 currentBuildingDto,
                                                                 BuildingDto.class,
                                                                 viewClass);

        // additional validation and business logic processing before applying patch properties
        validateBuildingDto(patchedBuildingDto, currentBuilding);

        return buildingMapper.toBuildingDto(buildingMapper.toExistingBuilding(patchedBuildingDto, currentBuilding));
    }

    @Transactional
    public void deleteById(UUID buildingId) {
        if (buildingRepository.existsById(buildingId)) {
            buildingRepository.deleteById(buildingId);
        } else {
            throw new ResourceNotFoundException(Building.class, buildingId);
        }
    }

    private void validateBuildingDto(BuildingDto buildingDto, Building building) {
        if (building == null ||
                (buildingDto.getBuildingNumber() != null &&
                        !buildingDto.getBuildingNumber().equals(building.getBuildingNumber()))) {
            if (buildingRepository.existsByBuildingNumber(buildingDto.getBuildingNumber())) {
                throw new ValidationException("Building number '"
                                                      + buildingDto.getBuildingNumber()
                                                      + "' already exists!");
            }
        }
        if (building == null || (
                buildingDto.getBuildingCode() != null &&
                        !buildingDto.getBuildingCode().equals(building.getBuildingCode()))) {
            if (buildingRepository.existsByBuildingCode(buildingDto.getBuildingCode())) {
                throw new ValidationException("Building code '" + buildingDto.getBuildingCode() + "' already exists!");
            }
        }
    }
}