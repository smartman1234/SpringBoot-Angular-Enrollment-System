package io.spring.enrollmentsystem.feature.room;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.AdminView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.spring.enrollmentsystem.feature.building.Building_;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

/**
 * (Room) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class RoomDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "3")
    private Integer roomNumber;

    @JsonView(BaseView.Low.class)
    @Schema(example = "35")
    private Integer roomCapacity;

    @JsonView(BaseView.Low.class)
    @Schema(example = "7ce3cd4f-b8b1-4108-94b4-c5b45463bb31")
    @NotNull
    private UUID buildingId;

}