package io.spring.enrollmentsystem.feature.college;

import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.department.Department;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Cacheable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

/**
 * (College) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Entity
@Table(name="college")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfDepartment"})
public class College extends DateAuditWithID {

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Department> listOfDepartment = new HashSet<>();

    @Column(nullable = false, length = 100)
    private String collegeName;

}




