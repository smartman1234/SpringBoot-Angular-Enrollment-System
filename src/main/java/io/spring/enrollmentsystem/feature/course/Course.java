package io.spring.enrollmentsystem.feature.course;

import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.section.Section;
import io.spring.enrollmentsystem.feature.subject.Subject;
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
import javax.persistence.FetchType;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

/**
 * (Course) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Entity
@Table(
        name = "course",
        indexes = {@Index(name = "course_code", columnList = "course_code")}
)
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfSection", "subject"})
public class Course extends DateAuditWithID {

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Section> listOfSection = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "course_code", nullable = false, unique = true)
    private String courseCode;

    @Column(length = 200)
    private String courseName;

    @Column(length = 3000)
    private String courseDescription;

    @Column(nullable = false)
    private Integer courseUnit;

    @Column(nullable = false)
    private Integer courseNumber;

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
        try {
            this.courseNumber = Integer.parseInt(courseCode.replaceAll("[\\D]*", ""));
        } catch (NumberFormatException ex) {
            this.courseNumber = 0;
        }
    }
}




