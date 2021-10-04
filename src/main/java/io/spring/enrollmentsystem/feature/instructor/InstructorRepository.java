package io.spring.enrollmentsystem.feature.instructor;

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
 * (Instructor) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
public interface InstructorRepository extends
        PagingAndSortingRepository<Instructor, UUID>,
        CustomRepository<Instructor, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Instructor> findById(@NonNull UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    @EntityGraph(attributePaths = {Instructor_.LIST_OF_SECTION})
    Optional<Instructor> findWithListOfSectionById(UUID id);

}