package io.spring.enrollmentsystem.feature.subject;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import javax.validation.ValidationException;
import java.util.List;
import java.util.UUID;

/**
 * (Subject) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Subject getSubjectById(UUID subjectId) {
        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException(Subject.class, subjectId));
    }

    @Transactional(readOnly = true)
    public SubjectDto getSubjectDtoById(UUID subjectId) {
        return subjectMapper.toSubjectDto(getSubjectById(subjectId));
    }

    @Transactional(readOnly = true)
    public List<SubjectDto> getAllSubjectDtoByPredicate(MultiValueMap<String, String> parameters) {
        return subjectRepository
                .findAll(SubjectDto.class, specificationService.getSpecifications(parameters));
    }

    @Transactional(readOnly = true)
    public Page<SubjectDto> getSubjectDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                             Pageable pageable) {
        return subjectRepository
                .findAll(SubjectDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<SubjectDto> getSubjectDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                           Pageable pageable) {
        return subjectRepository
                .findAllSlice(SubjectDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public SubjectDto createSubject(SubjectDto subjectDto) {
        Subject transientSubject = subjectMapper.toSubject(subjectDto);

        // additional validation and business logic processing before
        validateSubjectDto(subjectDto, null);

        return subjectMapper.toSubjectDto(subjectRepository.save(transientSubject));
    }

    @Transactional
    public SubjectDto updateSubject(UUID subjectId, SubjectDto subjectDto) {
        Subject currentSubject = getSubjectById(subjectId);

        // additional validation and business logic processing before applying update properties
        validateSubjectDto(subjectDto, currentSubject);

        return subjectMapper.toSubjectDto(subjectMapper.toExistingSubject(subjectDto, currentSubject));
    }

    @Transactional
    public SubjectDto patchSubject(UUID subjectId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Subject currentSubject = getSubjectById(subjectId);
        SubjectDto currentSubjectDto = subjectMapper.toSubjectDto(currentSubject);

        SubjectDto patchedSubjectDto = patchService.mergePatch(mergePatchDocument,
                                                               currentSubjectDto,
                                                               SubjectDto.class,
                                                               viewClass);

        // additional validation and business logic processing before applying patch properties
        validateSubjectDto(patchedSubjectDto, currentSubject);

        subjectMapper.toExistingSubject(patchedSubjectDto, currentSubject);
        return subjectMapper.toSubjectDto(currentSubject);
    }

    @Transactional
    public void deleteById(UUID subjectId) {
        if (subjectRepository.existsById(subjectId)) {
            subjectRepository.deleteById(subjectId);
        } else {
            throw new ResourceNotFoundException(Subject.class, subjectId);
        }
    }

    private void validateSubjectDto(SubjectDto subjectDto, Subject subject) {
        if (subject == null ||
                (subjectDto.getSubjectAcronym() != null &&
                        !subjectDto.getSubjectAcronym().equals(subject.getSubjectAcronym()))) {
            if (subjectRepository.existsBySubjectAcronym(subjectDto.getSubjectAcronym())) {
                throw new ValidationException("Subject acronym already exists!");
            }
        }
    }
}