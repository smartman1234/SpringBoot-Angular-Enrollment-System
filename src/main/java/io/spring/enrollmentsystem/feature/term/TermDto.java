package io.spring.enrollmentsystem.feature.term;

import com.fasterxml.jackson.annotation.JsonView;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

/**
 * (Term) dto
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class TermDto {

    @JsonView(BaseView.Id.class)
    private UUID id;

    @JsonView(BaseView.Low.class)
    @Schema(example = "Fall Semester 2021")
    @Size(max = 50)
    private String termName;

    @JsonView(BaseView.Low.class)
    @Schema(example = "2021-08-23")
    private LocalDate dateStart;

    @JsonView(BaseView.Low.class)
    @Schema(example = "2021-12-10")
    private LocalDate dateEnd;

}