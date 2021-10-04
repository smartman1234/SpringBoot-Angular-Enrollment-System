package io.spring.enrollmentsystem.feature.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.spring.enrollmentsystem.common.annotation.Default;
import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.authority.Authority;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

/**
 * Change table's name from "user" to "users" due to
 * Postgres reserved key word for "user"
 */
@Entity
@Table(name="user")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = {"authorities", "password"})
public class User extends DateAuditWithID implements UserDetails {

    @NotNull
    @Column(unique = true, nullable = false, updatable = false)
    @Setter(value = AccessLevel.NONE)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String username;

    @NotNull
    private String password;

    private Boolean enabled;

    private String firstName;

    private String lastName;

    @ManyToMany
    @JoinTable(name = "user_authority",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id"))
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Authority> authorities = new HashSet<>();

    @Default
    public User(String username, String firstName, String lastName, String password) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.enabled;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.enabled;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
