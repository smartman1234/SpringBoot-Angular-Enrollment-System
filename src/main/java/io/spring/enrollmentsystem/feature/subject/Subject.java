package io.spring.enrollmentsystem.feature.subject;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.course.Course;
import io.spring.enrollmentsystem.feature.department.Department;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Cacheable;
import javax.persistence.CascadeType;
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
 * (Subject) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Entity
@Table(name = "subject")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfCourse", "department"})
public class Subject extends DateAuditWithID {

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Course> listOfCourse = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(length = 100)
    private String subjectName;

    @Column(nullable = false, length = 3, unique = true, updatable = false)
    private String subjectAcronym;

}




