package io.spring.enrollmentsystem.feature.section;

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
 * (Section) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
public interface SectionRepository extends
        PagingAndSortingRepository<Section, UUID>,
        CustomRepository<Section, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Section> findById(@NonNull UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    @EntityGraph(attributePaths = {Section_.COURSE, Section_.TERM})
    Optional<Section> findWithCourseAndTermById(UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    int countByCourse_IdAndTerm_Id(UUID courseId, UUID termId);
}