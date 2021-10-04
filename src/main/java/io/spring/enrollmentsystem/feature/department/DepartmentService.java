package io.spring.enrollmentsystem.feature.department;

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
 * (Department) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Department getDepartmentById(UUID departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(Department.class, departmentId));
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentDtoById(UUID departmentId) {
        return departmentMapper.toDepartmentDto(getDepartmentById(departmentId));
    }

    @Transactional(readOnly = true)
    public Page<DepartmentDto> getDepartmentDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                                   Pageable pageable) {
        return departmentRepository
                .findAll(Department.class, specificationService.getSpecifications(parameters), pageable)
                .map(departmentMapper::toDepartmentDto);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        validateDepartmentDto(departmentDto, null);
        Department transientDepartment = departmentMapper.toDepartment(departmentDto);
        return departmentMapper.toDepartmentDto(departmentRepository.save(transientDepartment));
    }

    @Transactional
    public DepartmentDto updateDepartment(UUID departmentId, DepartmentDto departmentDto) {
        Department currentDepartment = getDepartmentById(departmentId);

        validateDepartmentDto(departmentDto, currentDepartment);

        return departmentMapper
                .toDepartmentDto(departmentMapper.toExistingDepartment(departmentDto, currentDepartment));
    }

    @Transactional
    public DepartmentDto patchDepartment(UUID departmentId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Department currentDepartment = getDepartmentById(departmentId);
        DepartmentDto currentDepartmentDto = departmentMapper.toDepartmentDto(currentDepartment);

        DepartmentDto patchedDepartmentDto = patchService.mergePatch(mergePatchDocument,
                                                                     currentDepartmentDto,
                                                                     DepartmentDto.class,
                                                                     viewClass);

        // additional validation and business logic processing before applying patch properties
        validateDepartmentDto(patchedDepartmentDto, currentDepartment);

        return departmentMapper
                .toDepartmentDto(departmentMapper.toExistingDepartment(patchedDepartmentDto, currentDepartment));
    }

    @Transactional
    public void deleteById(UUID departmentId) {
        if (departmentRepository.existsById(departmentId)) {
            departmentRepository.deleteById(departmentId);
        } else {
            throw new ResourceNotFoundException(Department.class, departmentId);
        }
    }

    private void validateDepartmentDto(DepartmentDto departmentDto, Department department) {
        if (department == null || (departmentDto.getDepartmentName() != null &&
                !departmentDto.getDepartmentName().equals(department.getDepartmentName()))) {
            if (departmentRepository.existsByDepartmentName(departmentDto.getDepartmentName())) {
                throw new ValidationException("Department name already exists!");
            }
        }
    }
}