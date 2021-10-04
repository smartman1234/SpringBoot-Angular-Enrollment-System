package io.spring.enrollmentsystem.feature.term;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * (Term) mapper
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Mapper(uses = {})
public interface TermMapper {

    TermMapper INSTANCE = Mappers.getMapper(TermMapper.class);

    TermDto toTermDto(Term term);

    Term toTerm(TermDto termDto);

    Term toExistingTerm(TermDto termDto, @MappingTarget Term term);

}