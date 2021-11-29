package io.spring.enrollmentsystem.feature.admin;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.UUID;

public interface AdminRepository extends PagingAndSortingRepository<Admin, UUID> {

}
