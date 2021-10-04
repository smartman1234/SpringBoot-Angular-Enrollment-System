package io.spring.enrollmentsystem.feature.enrollment;

import io.spring.enrollmentsystem.common.repository.CustomRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.QueryHint;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.annotations.QueryHints.CACHEABLE;

/**
 * (Enrollment) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
public interface EnrollmentRepository extends
        PagingAndSortingRepository<Enrollment, EnrollmentId>,
        CustomRepository<Enrollment, EnrollmentId> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Enrollment> findById_StudentIdAndId_SectionId(UUID studentId, UUID sectionId);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    boolean existsById_StudentIdAndId_SectionId(UUID studentId, UUID sectionId);

    void deleteById_StudentIdAndId_SectionId(UUID studentId, UUID sectionId);
}