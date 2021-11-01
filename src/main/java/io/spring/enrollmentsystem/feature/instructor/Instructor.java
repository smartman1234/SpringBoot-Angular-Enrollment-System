package io.spring.enrollmentsystem.feature.instructor;

import io.spring.enrollmentsystem.common.annotation.Default;
import io.spring.enrollmentsystem.feature.department.Department;
import io.spring.enrollmentsystem.feature.section.Section;
import io.spring.enrollmentsystem.feature.user.User;
import io.spring.enrollmentsystem.feature.user.UserProfile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;

/**
 * (Instructor) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Entity
@DiscriminatorValue("Instructor")
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfSection", "department"})
public class Instructor extends UserProfile {

    @OneToMany(mappedBy = "instructor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Section> listOfSection = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Default
    public Instructor(User user) {
        super(user);
    }

}




