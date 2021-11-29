package io.spring.enrollmentsystem.feature.college;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.UUID;

/**
 * (College) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final CollegeMapper collegeMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public College getCollegeById(UUID collegeId) {
        return collegeRepository.findById(collegeId)
                .orElseThrow(() -> new ResourceNotFoundException(College.class, collegeId));
    }

    @Transactional(readOnly = true)
    public CollegeDto getCollegeDtoById(UUID collegeId) {
        return collegeMapper.toCollegeDto(getCollegeById(collegeId));
    }

    @Transactional(readOnly = true)
    public List<CollegeDto> getAllCollegeDtoByPredicate(MultiValueMap<String, String> parameters) {
        return collegeRepository
                .findAll(CollegeDto.class,
                         specificationService.getSpecifications(parameters),
                         Sort.by(College_.COLLEGE_NAME));
    }

    @Transactional(readOnly = true)
    public Page<CollegeDto> getCollegeDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                             Pageable pageable) {
        return collegeRepository
                .findAll(College.class, specificationService.getSpecifications(parameters), pageable)
                .map(collegeMapper::toCollegeDto);
    }

    @Transactional(readOnly = true)
    public Slice<CollegeDto> getCollegeDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                           Pageable pageable) {
        return collegeRepository
                .findAllSlice(CollegeDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public CollegeDto createCollege(CollegeDto collegeDto) {
        College transientCollege = collegeMapper.toCollege(collegeDto);
        return collegeMapper.toCollegeDto(collegeRepository.save(transientCollege));
    }

    @Transactional
    public CollegeDto updateCollege(UUID collegeId, CollegeDto collegeDto) {
        College currentCollege = getCollegeById(collegeId);
        return collegeMapper.toCollegeDto(collegeMapper.toExistingCollege(collegeDto, currentCollege));
    }

    @Transactional
    public CollegeDto patchCollege(UUID collegeId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        College currentCollege = getCollegeById(collegeId);
        CollegeDto currentCollegeDto = collegeMapper.toCollegeDto(currentCollege);

        CollegeDto patchedCollegeDto = patchService.mergePatch(mergePatchDocument,
                                                               currentCollegeDto,
                                                               CollegeDto.class,
                                                               viewClass);

        // additional validation and business logic processing before applying patch properties

        return collegeMapper.toCollegeDto(collegeMapper.toExistingCollege(patchedCollegeDto, currentCollege));
    }

    @Transactional
    public void deleteById(UUID collegeId) {
        if (collegeRepository.existsById(collegeId)) {
            collegeRepository.deleteById(collegeId);
        } else {
            throw new ResourceNotFoundException(College.class, collegeId);
        }
    }

}