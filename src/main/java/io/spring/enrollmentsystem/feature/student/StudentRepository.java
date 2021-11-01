package io.spring.enrollmentsystem.feature.student;

import io.spring.enrollmentsystem.common.repository.CustomRepository;
import lombok.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import javax.persistence.QueryHint;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.annotations.QueryHints.CACHEABLE;

/**
 * (Student) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
public interface StudentRepository extends
        PagingAndSortingRepository<Student, UUID>,
        CustomRepository<Student, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Student> findById(@NonNull UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    @Query("select student from Student student join fetch student.listOfEnrollment where student.id=:id")
    Optional<Student> findWithListOfEnrollmentById(@Param("id") UUID id);

//    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
//    @EntityGraph(attributePaths = {"listOfEnrollment"})
//    Optional<Student> findWithListOfEnrollmentById(UUID id);
}