package io.spring.enrollmentsystem.feature.building;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

/**
 * (Building) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class BuildingDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "1")
    @NotNull
    private Integer buildingNumber;

    @JsonView(BaseView.Low.class)
    @Schema(example = "College of Agriculture")
    @Size(max = 100)
    private String buildingName;

    @JsonView(BaseView.Low.class)
    @Schema(example = "CA")
    @Size(max = 10)
    private String buildingCode;

}