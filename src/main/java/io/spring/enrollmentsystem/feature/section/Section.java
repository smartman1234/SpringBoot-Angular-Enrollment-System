package io.spring.enrollmentsystem.feature.section;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.course.Course;
import io.spring.enrollmentsystem.feature.enrollment.Enrollment;
import io.spring.enrollmentsystem.feature.instructor.Instructor;
import io.spring.enrollmentsystem.feature.room.Room;
import io.spring.enrollmentsystem.feature.term.Term;
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
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * (Section) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Entity
@Table(
        name = "section",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id", "term_id", "section_number"})},
        indexes = {@Index(name = "course_id", columnList = "course_id")}
)
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfEnrollment", "room", "term", "course", "instructor"})
public class Section extends DateAuditWithID {

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Enrollment> listOfEnrollment = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @Column(name = "section_number", nullable = false, updatable = false)
    private Integer sectionNumber;

    @Column(length = 50)
    private String meetingDays;

    private LocalTime meetingTimeStart;

    private LocalTime meetingTimeEnd;

    @Column(nullable = false)
    private Integer classCapacity;

    @Column(nullable = false)
    private Integer waitlistCapacity;

    private Integer enrolledNumber = 0;

    private Integer waitingNumber = 0;

    @Column(nullable = false)
    private LocalDate dateStart;

    @Column(nullable = false)
    private LocalDate dateEnd;

    @Column(nullable = false, length = 20)
    private String sectionStatus;
}




