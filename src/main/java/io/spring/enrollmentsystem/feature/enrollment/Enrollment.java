package io.spring.enrollmentsystem.feature.enrollment;

import io.spring.enrollmentsystem.common.annotation.Default;
import io.spring.enrollmentsystem.common.entity.DateAudit;
import io.spring.enrollmentsystem.feature.section.Section;
import io.spring.enrollmentsystem.feature.student.Student;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

/**
 * (Enrollment) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Entity
@Table(name="enrollment")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@ToString(exclude = {"student", "section"})
public class Enrollment extends DateAudit {

    @EmbeddedId
    private EnrollmentId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("studentId")
    @EqualsAndHashCode.Include
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("sectionId")
    @EqualsAndHashCode.Include
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(length = 45)
    private String enrollmentStatus;

    @Column(length = 100)
    private String accessCode;

    @Default
    public Enrollment(Student student, Section section) {
        this.student = student;
        this.section = section;
        this.id = new EnrollmentId(student.getId(), section.getId());
    }
}




