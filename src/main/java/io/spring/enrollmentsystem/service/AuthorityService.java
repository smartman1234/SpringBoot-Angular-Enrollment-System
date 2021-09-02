package io.spring.enrollmentsystem.service;

import io.spring.enrollmentsystem.dto.AuthorityDto;
import io.spring.enrollmentsystem.entity.Authority;
import io.spring.enrollmentsystem.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.mapper.AuthorityMapper;
import io.spring.enrollmentsystem.repository.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;
    private final AuthorityMapper authorityMapper;

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
    public Page<AuthorityDto> getAuthorityDtoPageable(Pageable pageable) {
        return authorityRepository.findAll(pageable)
                .map(authorityMapper::toAuthorityDto);
    }

    @Transactional
    public AuthorityDto createAuthority(AuthorityDto authorityDto) {
        String role = authorityDto.getRole();
        if (authorityRepository.findByRole(role).isPresent()) {
            throw new ValidationException("Authority with role name '" + role + "' already exists!");
        }

        Authority authority = authorityMapper.toAuthority(authorityDto);

        return authorityMapper.toAuthorityDto(authorityRepository.save(authority));
    }

    @Transactional
    public AuthorityDto updateAuthority(UUID authorityId, AuthorityDto authorityDto) {
        Authority currentAuthority = getAuthorityById(authorityId);

        String role = authorityDto.getRole();
        if (!currentAuthority.getRole().equals(role) && authorityRepository.findByRole(role).isPresent()) {
            throw new ValidationException("Authority with role name '" + role + "' already exists!");
        }

        authorityMapper.toExistingAuthority(authorityDto, currentAuthority);
        return authorityMapper.toAuthorityDto(currentAuthority);
    }

    @Transactional
    public void deleteById(UUID authorityId) {
        if (authorityRepository.existsById(authorityId)) {
            authorityRepository.deleteById(authorityId);
        } else {
            throw new ResourceNotFoundException(Authority.class, authorityId);
        }
    }
}
