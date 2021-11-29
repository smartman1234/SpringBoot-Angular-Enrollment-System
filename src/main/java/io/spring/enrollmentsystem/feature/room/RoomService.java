package io.spring.enrollmentsystem.feature.room;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.UUID;

/**
 * (Room) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Room getRoomById(UUID roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(Room.class, roomId));
    }

    @Transactional(readOnly = true)
    public Room getRoomWithListOfSection(UUID roomId) {
        return roomRepository.findWithListOfSectionById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(Room.class, roomId));
    }

    @Transactional(readOnly = true)
    public RoomDto getRoomDtoById(UUID roomId) {
        return roomRepository.findById(RoomDto.class, roomId)
                .orElseThrow(() -> new ResourceNotFoundException(Room.class, roomId));
    }

    @Transactional(readOnly = true)
    public List<RoomDto> getAllRoomDtoByPredicate(MultiValueMap<String, String> parameters) {
        return roomRepository
                .findAll(RoomDto.class,
                         specificationService.getSpecifications(parameters),
                         Sort.by(Room_.ROOM_NUMBER));
    }

    @Transactional(readOnly = true)
    public Page<RoomDto> getRoomDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                       Pageable pageable) {
        return roomRepository
                .findAll(RoomDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<RoomDto> getRoomDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                     Pageable pageable) {
        return roomRepository
                .findAllSlice(RoomDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public RoomDto createRoom(RoomDto roomDto) {
        Room transientRoom = roomMapper.toRoom(roomDto);

        // additional validation and business logic processing before saving

        return roomMapper.toRoomDto(roomRepository.save(transientRoom));
    }

    @Transactional
    public RoomDto updateRoom(UUID roomId, RoomDto roomDto) {
        Room currentRoom = getRoomById(roomId);

        // additional validation and business logic processing before applying update properties

        return roomMapper.toRoomDto(roomMapper.toExistingRoom(roomDto, currentRoom));
    }

    @Transactional
    public RoomDto patchRoom(UUID roomId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Room currentRoom = getRoomById(roomId);
        RoomDto currentRoomDto = roomMapper.toRoomDto(currentRoom);

        RoomDto patchedRoomDto = patchService.mergePatch(mergePatchDocument,
                                                         currentRoomDto,
                                                         RoomDto.class,
                                                         viewClass);

        // additional validation and business logic processing before applying patch properties

        return roomMapper.toRoomDto(roomMapper.toExistingRoom(patchedRoomDto, currentRoom));
    }

    @Transactional
    public void deleteById(UUID roomId) {
        if (roomRepository.existsById(roomId)) {
            roomRepository.deleteById(roomId);
        } else {
            throw new ResourceNotFoundException(Room.class, roomId);
        }
    }
}