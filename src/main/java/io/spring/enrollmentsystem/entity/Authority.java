package io.spring.enrollmentsystem.entity;

import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
public class Authority extends DateAuditWithID implements GrantedAuthority {

    @NotNull
    @Column(unique = true)
    private String role;

    @ManyToMany(mappedBy = "authorities")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<User> users = new HashSet<>();

    @Default
    public Authority(String role) {
        this.role = role;
    }

    @Override
    public String getAuthority() {
        return this.role;
    }

    @PreRemove
    private void removeAuthoritiesFromUsers() {
        for (User user : this.getUsers()) {
            user.getAuthorities().remove(this);
        }
    }

    @Override
    public String toString() {
        return "Authority{" +
                "authority='" + getAuthority() + '\'' +
                '}';
    }
}
