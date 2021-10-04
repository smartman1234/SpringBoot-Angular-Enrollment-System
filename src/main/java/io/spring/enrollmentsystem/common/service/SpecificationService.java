package io.spring.enrollmentsystem.common.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.MultiValueMap;

public interface SpecificationService {

    <T> Specification<T> getSpecifications(MultiValueMap<String, String> parameters);
}
