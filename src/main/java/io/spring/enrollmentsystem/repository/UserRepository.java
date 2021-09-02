package io.spring.enrollmentsystem.repository;

import io.spring.enrollmentsystem.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.QueryHint;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.annotations.QueryHints.CACHEABLE;

public interface UserRepository extends PagingAndSortingRepository<User, UUID> {

    @EntityGraph(attributePaths = {"authorities"})
    Optional<User> findByUsername(String username);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    @EntityGraph(attributePaths = {"authorities"})
    Optional<User> findWithAuthoritiesById(UUID id);
}
