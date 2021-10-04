package io.spring.enrollmentsystem.feature.building;

import io.spring.enrollmentsystem.common.entity.DateAuditWithID;
import io.spring.enrollmentsystem.feature.room.Room;
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
import java.util.HashSet;
import java.util.Set;

/**
 * (Building) entity
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Entity
@Table(name="building")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter @Setter @NoArgsConstructor
@ToString(exclude = {"listOfRoom"})
public class Building extends DateAuditWithID {

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Room> listOfRoom = new HashSet<>();

    @Column(nullable = false, unique = true)
    private Integer buildingNumber;

    @Column(length = 100)
    private String buildingName;

    @Column(length = 10, unique = true)
    private String buildingCode;

}




