package io.spring.enrollmentsystem.feature.enrollment;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Cacheable;
import javax.persistence.Embeddable;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.UUID;

/**
 * (Enrollment) entityId
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Embeddable
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"studentId", "sectionId"})})
@EqualsAndHashCode
public class EnrollmentId implements Serializable {

    private static final long serialVersionUID = 1420104074L;

    private UUID studentId;

    private UUID sectionId;

}