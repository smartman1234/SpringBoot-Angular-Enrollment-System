package io.spring.enrollmentsystem.feature.student;

import io.spring.enrollmentsystem.common.annotation.Default;
import io.spring.enrollmentsystem.feature.enrollment.Enrollment;
import io.spring.enrollmentsystem.feature.user.User;
import io.spring.enrollmentsystem.feature.user.UserProfile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;

/**
 * (Student) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Entity
@DiscriminatorValue("Student")
@Getter @Setter @NoArgsConstructor
@ToString(callSuper = true, exclude = {"listOfEnrollment"})
public class Student extends UserProfile {

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Enrollment> listOfEnrollment = new HashSet<>();

    private Integer maxUnit = 16;

    @Default
    public Student(User user, Integer maxUnit) {
        super(user);
        this.maxUnit = maxUnit;
    }
}




