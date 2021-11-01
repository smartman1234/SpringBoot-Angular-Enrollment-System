package io.spring.enrollmentsystem.feature.enrollment;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Cacheable;
import javax.persistence.Embeddable;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * (Enrollment) entityId
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Embeddable
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Getter @NoArgsConstructor @AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"studentId", "sectionId"})})
public class EnrollmentId implements Serializable {

    private static final long serialVersionUID = 1420104074L;

    private UUID studentId;

    private UUID sectionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EnrollmentId)) {
            return false;
        }
        EnrollmentId that = (EnrollmentId) o;
        return Objects.equals(studentId, that.studentId) && Objects.equals(sectionId, that.sectionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, sectionId);
    }
}