package io.spring.enrollmentsystem.feature.building;

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
 * (Building) repository
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
public interface BuildingRepository extends
        PagingAndSortingRepository<Building, UUID>,
        CustomRepository<Building, UUID> {

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    Optional<Building> findById(@NonNull UUID id);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    boolean existsByBuildingNumber(Integer buildingNumber);

    @QueryHints(@QueryHint(name = CACHEABLE, value = "true"))
    boolean existsByBuildingCode(String buildingCode);

}