package io.spring.enrollmentsystem.feature.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.spring.enrollmentsystem.common.entity.DateAudit;
import io.spring.enrollmentsystem.common.entity.ID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name="user_profile")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_profile_type")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"user"})
public class UserProfile extends DateAudit implements Serializable {
    private static final long serialVersionUID = 92461720176821L;

    @Id
    @Setter(value = AccessLevel.NONE)
    private UUID id;

    @Version
    @Setter(value = AccessLevel.NONE)
    private Long version;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    private User user;

    @NotNull
    @Column(length = 50, unique = true, updatable = false)
    private String email;

    public UserProfile(User user) {
        if (user != null) {
            this.user = user;
            this.id = user.getId();
            this.email = user.getUsername() + "@cccd.edu";
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
        return Objects.hashCode(this.getId());
    }
}
