package io.spring.enrollmentsystem.feature.term;

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
 * (Term) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class TermService {

    private final TermRepository termRepository;
    private final TermMapper termMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Term getTermById(UUID termId) {
        return termRepository.findById(termId)
                .orElseThrow(() -> new ResourceNotFoundException(Term.class, termId));
    }

    @Transactional(readOnly = true)
    public TermDto getTermDtoById(UUID termId) {
        return termMapper.toTermDto(getTermById(termId));
    }

    @Transactional(readOnly = true)
    public List<TermDto> getAllTermDtoByPredicate(MultiValueMap<String, String> parameters) {
        return termRepository
                .findAll(TermDto.class, specificationService.getSpecifications(parameters), Sort.by(Term_.DATE_START));
    }

    @Transactional(readOnly = true)
    public Page<TermDto> getTermDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                       Pageable pageable) {
        return termRepository
                .findAll(TermDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<TermDto> getTermDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                     Pageable pageable) {
        return termRepository
                .findAllSlice(TermDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public TermDto createTerm(TermDto termDto) {
        Term transientTerm = termMapper.toTerm(termDto);

        // additional validation and business logic processing before saving

        return termMapper.toTermDto(termRepository.save(transientTerm));
    }

    @Transactional
    public TermDto updateTerm(UUID termId, TermDto termDto) {
        Term currentTerm = getTermById(termId);

        // additional validation and business logic processing before applying update properties

        return termMapper.toTermDto(termMapper.toExistingTerm(termDto, currentTerm));
    }

    @Transactional
    public TermDto patchTerm(UUID termId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Term currentTerm = getTermById(termId);
        TermDto currentTermDto = termMapper.toTermDto(currentTerm);

        TermDto patchedTermDto = patchService.mergePatch(mergePatchDocument,
                                                         currentTermDto,
                                                         TermDto.class,
                                                         viewClass);

        // additional validation and business logic processing before applying patch properties

        return termMapper.toTermDto(termMapper.toExistingTerm(patchedTermDto, currentTerm));
    }

    @Transactional
    public void deleteById(UUID termId) {
        if (termRepository.existsById(termId)) {
            termRepository.deleteById(termId);
        } else {
            throw new ResourceNotFoundException(Term.class, termId);
        }
    }

}