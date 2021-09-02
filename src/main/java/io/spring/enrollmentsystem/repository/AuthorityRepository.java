package io.spring.enrollmentsystem.repository;

import io.spring.enrollmentsystem.entity.Authority;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.QueryHint;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.annotations.QueryHints.CACHEABLE;

public interface AuthorityRepository extends PagingAndSortingRepository<Authority, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    @EntityGraph(attributePaths = {"users"})
    Optional<Authority> findWithUsersById(UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    @EntityGraph(attributePaths = {"users"})
    Optional<Authority> findWithUsersByRole(String role);

    Optional<Authority> findByRole(String role);
}
