package io.spring.enrollmentsystem.feature.department;

import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.college.College;
import io.spring.enrollmentsystem.feature.instructor.Instructor;
import io.spring.enrollmentsystem.feature.subject.Subject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

/**
 * (Department) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Entity
@Table(name="department")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfSubject", "listOfInstructor", "college"})
public class Department extends DateAuditWithID {

    @OneToMany(mappedBy = "department")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Subject> listOfSubject = new HashSet<>();

    @OneToMany(mappedBy = "department")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Instructor> listOfInstructor = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(nullable = false, length = 100, unique = true)
    private String departmentName;

}




