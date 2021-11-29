package io.spring.enrollmentsystem.common.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.lang.Nullable;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

import static org.hibernate.annotations.QueryHints.CACHEABLE;

/**
 * This custom repository allows DTO projection and JPA specification to work together
 * @param <T>  - the type of the entity to handle
 * @param <ID> - the type of the entity's identifier
 */
@NoRepositoryBean
public interface CustomRepository<T, ID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    <S> Optional<S> findById(Class<S> type, ID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    <S> Page<S>  findAll(Class<S> type, @Nullable Specification<T> spec, Pageable pageable);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    <S> Slice<S> findAllSlice(Class<S> type, @Nullable Specification<T> spec, Pageable pageable);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    <S> List<S> findAll(Class<S> type, @Nullable Specification<T> spec);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    <S> List<S> findAll(Class<S> type, @Nullable Specification<T> spec, Sort sort);
}
