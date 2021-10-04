package io.spring.enrollmentsystem.feature.term;

import io.spring.enrollmentsystem.common.repository.CustomRepository;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.QueryHint;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.annotations.QueryHints.CACHEABLE;

/**
 * (Term) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
public interface TermRepository extends
        PagingAndSortingRepository<Term, UUID>,
        CustomRepository<Term, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Term> findById(@NonNull UUID id);

}