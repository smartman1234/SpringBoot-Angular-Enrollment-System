package io.spring.enrollmentsystem.feature.room;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.validator.ValidationGroup;
import io.spring.enrollmentsystem.common.view.BaseView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.groups.Default;
import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * (Room) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@RestController @RequestMapping("/api/v1/admin/rooms")
@Tag(name = "room", description = "room API")
@Validated @PreAuthorize("hasRole(@Role.ADMIN)")
@RequiredArgsConstructor @Slf4j
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/{roomId}")
    @Operation(summary = "Find room by id", tags = "room")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<RoomDto> getRoom(@PathVariable UUID roomId) {
        return ResponseEntity
                .ok()
                .body(roomService.getRoomDtoById(roomId));
    }

    @GetMapping("")
    @Operation(summary = "Find all instances of room by predicate", tags = "room")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<List<RoomDto>> getAllRoomByPredicate(
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(roomService.getAllRoomDtoByPredicate(parameters));
    }

    @GetMapping("/page")
    @Operation(summary = "Find all instances of room as pages by predicate", tags = "room")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<Page<RoomDto>> getRoomPageableByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(roomService.getRoomDtoPageableByPredicate(parameters, pageable));
    }

    @GetMapping("/slice")
    @Operation(summary = "Find all instances of room as slices by predicate", tags = "room")
    @JsonView(BaseView.HighWithId.class)
    public ResponseEntity<Slice<RoomDto>> getRoomSliceByPredicate(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) MultiValueMap<String, String> parameters) {

        return ResponseEntity
                .ok()
                .body(roomService.getRoomDtoSliceByPredicate(parameters, pageable));
    }

    @PostMapping("")
    @Operation(summary = "Add a new room", tags = "room")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<RoomDto> createRoom(@RequestBody
                                              @Validated({ValidationGroup.onCreate.class, Default.class})
                                              @JsonView(BaseView.Create.class)
                                                      RoomDto roomDto) {
        RoomDto response = roomService.createRoom(roomDto);
        String roomId = String.valueOf(response.getId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri().path("/{roomId}")
                .buildAndExpand(roomId).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{roomId}")
    @Operation(summary = "Update a room by id", tags = "room")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<RoomDto> updateRoom(@PathVariable UUID roomId,
                                              @RequestBody @Valid
                                              @JsonView(BaseView.Update.class)
                                                      RoomDto roomDto) {
        RoomDto response = roomService.updateRoom(roomId, roomDto);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping(path = "/{roomId}", consumes = "application/merge-patch+json")
    @Operation(summary = "Patch a room by id", tags = "room")
    @JsonView(BaseView.MediumWithId.class)
    public ResponseEntity<RoomDto> patchRoom(@PathVariable UUID roomId,
                                             @RequestBody JsonMergePatch mergePatchDocument) {
        RoomDto response = roomService.patchRoom(roomId, mergePatchDocument, BaseView.Update.class);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{roomId}")
    @Operation(summary = "Delete a room by id", tags = "room")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID roomId) {
        roomService.deleteById(roomId);
        return ResponseEntity.noContent().build();
    }

}