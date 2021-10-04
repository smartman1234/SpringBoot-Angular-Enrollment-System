package io.spring.enrollmentsystem.common.mapper;

import io.spring.enrollmentsystem.common.entity.ID;
import io.spring.enrollmentsystem.feature.user.UserProfile;
import lombok.NonNull;
import org.mapstruct.TargetType;

import java.util.UUID;

public interface ReferenceMapper {

    <T extends ID> T idToEntity(UUID id, @TargetType Class<T> entityClass);

    <T extends UserProfile> T mapsIdToEntity(UUID id, @TargetType Class<T> entityClass);

    <T> T getReference(@NonNull UUID id, Class<T> entityClass);

    <T> T findById(UUID id, Class<T> entityClass);
}
