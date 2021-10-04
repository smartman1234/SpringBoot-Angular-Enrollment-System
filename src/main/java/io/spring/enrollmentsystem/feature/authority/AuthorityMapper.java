package io.spring.enrollmentsystem.feature.authority;

import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.Set;

@Mapper
public abstract class AuthorityMapper {

    public static final AuthorityMapper INSTANCE = Mappers.getMapper(AuthorityMapper.class);

    @Autowired
    private AuthorityRepository authorityRepository;

    public abstract AuthorityDto toAuthorityDto(Authority authority);

    public abstract Authority toAuthority(AuthorityDto authorityDto);

    public abstract Authority toExistingAuthority(AuthorityDto authorityDto, @MappingTarget Authority authority);

    public abstract Set<AuthorityDto> toAuthorityDtos(Set<Authority> authorities);

    public Set<Authority> toAuthorities(Set<AuthorityDto> authorityDtos) {
        if (authorityDtos == null) {
            return null;
        }

        Set<Authority> set = new HashSet<>(Math.max((int) (authorityDtos.size() / .75f) + 1, 16));
        for (AuthorityDto authorityDto : authorityDtos) {
            Authority currentAuthority = authorityRepository.findByRole(authorityDto.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException(Authority.class, "role", authorityDto.getRole()));
            set.add(toExistingAuthority(authorityDto, currentAuthority));
        }

        return set;
    }
}
