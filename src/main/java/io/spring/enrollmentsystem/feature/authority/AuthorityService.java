package io.spring.enrollmentsystem.feature.authority;

import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import javax.validation.ValidationException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;
    private final AuthorityMapper authorityMapper;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Authority getAuthorityById(UUID authorityId) {
        return authorityRepository.findById(authorityId).orElseThrow(
                () -> new ResourceNotFoundException(Authority.class, authorityId));
    }

    @Transactional(readOnly = true)
    public Authority getAuthorityByRole(String role) {
        return authorityRepository.findByRole(role).orElseThrow(
                () -> new ResourceNotFoundException(Authority.class, "role", role));
    }

    @Transactional(readOnly = true)
    public AuthorityDto getAuthorityDtoById(UUID authorityId) {
        return authorityMapper.toAuthorityDto(getAuthorityById(authorityId));
    }

    @Transactional(readOnly = true)
    public AuthorityDto getAuthorityDtoByRole(String role) {
        return authorityMapper.toAuthorityDto(getAuthorityByRole(role));
    }

    @Transactional(readOnly = true)
    public Page<AuthorityDto> getAuthorityDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                                 Pageable pageable) {
        return authorityRepository
                .findAll(Authority.class, specificationService.getSpecifications(parameters), pageable)
                .map(authorityMapper::toAuthorityDto);
    }

    @Transactional
    public AuthorityDto createAuthority(AuthorityDto authorityDto) {

        validateAuthorityDto(authorityDto, null);

        Authority transientAuthority = authorityMapper.toAuthority(authorityDto);
        return authorityMapper.toAuthorityDto(authorityRepository.save(transientAuthority));
    }

    @Transactional
    public AuthorityDto updateAuthority(UUID authorityId, AuthorityDto authorityDto) {
        Authority currentAuthority = getAuthorityById(authorityId);

        validateAuthorityDto(authorityDto, currentAuthority);
        return authorityMapper.toAuthorityDto(authorityMapper.toExistingAuthority(authorityDto, currentAuthority));
    }

    @Transactional
    public void deleteById(UUID authorityId) {
        if (authorityRepository.existsById(authorityId)) {
            authorityRepository.deleteById(authorityId);
        } else {
            throw new ResourceNotFoundException(Authority.class, authorityId);
        }
    }

    private void validateAuthorityDto(AuthorityDto authorityDto, Authority authority) {
        if (authority == null ||
                (authorityDto.getRole() != null &&
                        !authorityDto.getRole().equals(authority.getRole()))) {
            if (authorityRepository.existsByRole(authorityDto.getRole())) {
                throw new ValidationException("Authority with role '"
                                                      + authorityDto.getRole()
                                                      + "' already exists!");
            }
        }
    }
}
