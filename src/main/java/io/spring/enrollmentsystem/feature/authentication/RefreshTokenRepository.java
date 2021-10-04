package io.spring.enrollmentsystem.feature.authentication;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    List<RefreshToken> findAllByUserId(String userId);
}
