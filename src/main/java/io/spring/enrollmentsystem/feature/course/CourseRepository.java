package io.spring.enrollmentsystem.feature.course;

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
 * (Course) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
public interface CourseRepository extends
        PagingAndSortingRepository<Course, UUID>,
        CustomRepository<Course, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Course> findById(@NonNull UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    boolean existsByCourseCode(String courseCode);

}