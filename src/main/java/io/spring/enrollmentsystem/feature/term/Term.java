package io.spring.enrollmentsystem.feature.term;

import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.section.Section;
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
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * (Term) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Entity
@Table(name = "term")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfSection"})
public class Term extends DateAuditWithID {

    @OneToMany(mappedBy = "term", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Section> listOfSection = new HashSet<>();

    @Column(nullable = false, length = 50)
    private String termName;

    @Column(nullable = false)
    private LocalDate dateStart;

    @Column(nullable = false)
    private LocalDate dateEnd;

}




