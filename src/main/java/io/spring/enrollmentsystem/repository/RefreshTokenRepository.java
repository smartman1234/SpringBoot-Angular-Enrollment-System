package io.spring.enrollmentsystem.repository;

import io.spring.enrollmentsystem.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    List<RefreshToken> findAllByUserId(String userId);
}
