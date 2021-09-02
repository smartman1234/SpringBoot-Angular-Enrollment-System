package io.spring.enrollmentsystem.entity;

import lombok.Getter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@MappedSuperclass
public abstract class ID implements Serializable {
    private static final long serialVersionUID = 2575690552348142L;

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false, unique = true)
    private UUID id;

    @Version
    private Long version;

    public UUID getId() {
        initUUID();
        return this.id;
    }

    @PrePersist
    public void prePersist() {
        initUUID();
    }

    private void initUUID() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof ID)) {
            return false;
        }

        ID other = (ID) obj;
        return this.getId() != null && other.getId() != null
                && this.getId().equals(other.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.getId()); // for nullable object
    }
}
