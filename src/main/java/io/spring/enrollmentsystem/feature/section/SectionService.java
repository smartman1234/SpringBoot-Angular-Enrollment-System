package io.spring.enrollmentsystem.feature.section;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import io.spring.enrollmentsystem.feature.course.Course;
import io.spring.enrollmentsystem.feature.course.CourseService;
import io.spring.enrollmentsystem.feature.instructor.Instructor;
import io.spring.enrollmentsystem.feature.instructor.InstructorService;
import io.spring.enrollmentsystem.feature.room.Room;
import io.spring.enrollmentsystem.feature.room.RoomService;
import io.spring.enrollmentsystem.feature.term.Term;
import io.spring.enrollmentsystem.feature.term.TermService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import javax.validation.ValidationException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * (Section) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class SectionService {

    private final SectionRepository sectionRepository;
    private final SectionMapper sectionMapper;
    private final PatchService patchService;
    private final TermService termService;
    private final InstructorService instructorService;
    private final RoomService roomService;
    private final CourseService courseService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Section getSectionById(UUID sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(Section.class, sectionId));
    }

    @Transactional(readOnly = true)
    public Section getSectionWithCourseAndTermById(UUID sectionId) {
        return sectionRepository.findWithCourseAndTermById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(Section.class, sectionId));
    }

    @Transactional(readOnly = true)
    public SectionDto getSectionDtoById(UUID sectionId) {
        return sectionRepository.findById(SectionDto.class, sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(Section.class, sectionId));
    }

    @Transactional(readOnly = true)
    public Page<SectionDto> getSectionDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                             Pageable pageable) {
        return sectionRepository
                .findAll(SectionDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<SectionDto> getSectionDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                           Pageable pageable) {
        return sectionRepository
                .findAllSlice(SectionDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public List<SectionDto> getAllSectionDtoByPredicate(MultiValueMap<String, String> parameters) {
        List<SectionDto> sectionDtoList = sectionRepository
                .findAll(SectionDto.class, specificationService.getSpecifications(parameters));
        sectionDtoList
                .sort(Comparator.comparing(SectionDto::getCourseCode));
        return sectionDtoList;
    }

    @Transactional
    public SectionDto createSection(SectionDto sectionDto) {
        Section transientSection = sectionMapper.toSection(sectionDto);

        int currentSectionsCount = sectionRepository.countByCourse_IdAndTerm_Id(sectionDto.getCourseId(),
                                                                                sectionDto.getTermId());
        transientSection.setSectionNumber(currentSectionsCount + 1);

        validateSectionDto(sectionDto, null);

        return sectionMapper.toSectionDto(sectionRepository.save(transientSection));
    }

    @Transactional
    public SectionDto updateSection(UUID sectionId, SectionDto sectionDto) {
        Section currentSection = getSectionWithCourseAndTermById(sectionId);

        validateSectionDto(sectionDto, currentSection);

        return sectionMapper.toSectionDto(sectionMapper.toExistingSection(sectionDto, currentSection));
    }

    @Transactional
    public SectionDto patchSection(UUID sectionId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Section currentSection = getSectionWithCourseAndTermById(sectionId);
        SectionDto currentSectionDto = sectionMapper.toSectionDto(currentSection);

        SectionDto patchedSectionDto = patchService.mergePatch(mergePatchDocument,
                                                               currentSectionDto,
                                                               SectionDto.class,
                                                               viewClass);

        validateSectionDto(patchedSectionDto, currentSection);

        return sectionMapper.toSectionDto(sectionMapper.toExistingSection(patchedSectionDto, currentSection));
    }

    @Transactional
    public void deleteById(UUID sectionId) {
        if (sectionRepository.existsById(sectionId)) {
            sectionRepository.deleteById(sectionId);
        } else {
            throw new ResourceNotFoundException(Section.class, sectionId);
        }
    }

    private void validateSectionDto(@NonNull SectionDto sectionDto, Section currentSection) {
        Course currentCourse = null;
        UUID termId = currentSection != null ? currentSection.getTerm().getId() : sectionDto.getTermId();

        // validation for term schedule
        if (currentSection == null) {
            Term term = termService.getTermById(termId);

            if (term.getDateStart().isAfter(sectionDto.getDateStart())
                    || term.getDateEnd().isBefore(sectionDto.getDateEnd())) {
                throw new ValidationException("Section start and end dates are not valid for current term!");
            }
        }

        if (sectionDto.getInstructorId() == null && currentSection != null) {
            currentSection.setInstructor(null);
        }

        if (sectionDto.getRoomId() == null && currentSection != null) {
            currentSection.setRoom(null);
        }

        // if section schedule is unknown, skip validation for instructor and room schedule
        if (sectionDto.getMeetingDays() == null
                || sectionDto.getMeetingTimeStart() == null
                || sectionDto.getMeetingTimeEnd() == null) {
            return;
        }

        // validation for instructor's schedule
        if (sectionDto.getInstructorId() != null) {
            currentCourse = currentSection != null
                    ? currentSection.getCourse()
                    : courseService.getCourseById(sectionDto.getCourseId());

            Set<String> currentMeetingDays = new HashSet<>(
                    Set.of(sectionDto.getMeetingDays().split("(?=\\p{Upper})")));

            Instructor instructor = instructorService.getInstructorWithListOfSection(sectionDto.getInstructorId());

            for (Section section : instructor.getListOfSection()) {
                if (!section.getTerm().getId().equals(termId)
                        || section.getMeetingDays() == null
                        || section.getMeetingTimeStart() == null
                        || section.getMeetingTimeEnd() == null) {
                    continue;
                }

                Set<String> currentMeetingDaysCopy = new HashSet<>(currentMeetingDays);
                Set<String> meetingDays = Set.of(section.getMeetingDays().split("(?=\\p{Upper})"));
                currentMeetingDaysCopy.retainAll(meetingDays);

                // validate for time conflict in instructor's schedule
                if (currentMeetingDaysCopy.size() > 0) {
                    if (sectionDto.getMeetingTimeStart().isBefore(section.getMeetingTimeEnd().plusMinutes(10))
                            && section.getMeetingTimeStart().isBefore(sectionDto.getMeetingTimeEnd().plusMinutes(10))) {
                        Integer currentSectionNumber = currentSection != null
                                ? currentSection.getSectionNumber()
                                : sectionDto.getSectionNumber();
                        String currentSectionNumberHolder = currentSectionNumber != null
                                ? "." + String.format("%02d", currentSectionNumber)
                                : "";
                        throw new ValidationException("Schedule for instructor with name "
                                                              + instructor.getUser().getFirstName() + " "
                                                              + instructor.getUser().getLastName()
                                                              + ": Time conflict for section "
                                                              + currentCourse.getCourseCode()
                                                              + currentSectionNumberHolder
                                                              + " and scheduled section "
                                                              + section.getCourse().getCourseCode() + "."
                                                              + String.format("%02d",
                                                                              section.getSectionNumber()) + "!");
                    }
                }
            }

            // validation for instructor's schedule is passed, set instructor for current section
            if (currentSection != null) {
                currentSection.setInstructor(instructor);
            }
        }

        // validation for room's schedule
        if (sectionDto.getRoomId() != null) {
            if (currentCourse == null) {
                currentCourse = currentSection != null
                        ? currentSection.getCourse()
                        : courseService.getCourseById(sectionDto.getCourseId());
            }

            Set<String> currentMeetingDays = new HashSet<>(
                    Set.of(sectionDto.getMeetingDays().split("(?=\\p{Upper})")));

            Room room = roomService.getRoomWithListOfSection(sectionDto.getRoomId());

            for (Section section : room.getListOfSection()) {
                if (!section.getTerm().getId().equals(termId)
                        || section.getMeetingDays() == null
                        || section.getMeetingTimeStart() == null
                        || section.getMeetingTimeEnd() == null) {
                    continue;
                }

                Set<String> currentMeetingDaysCopy = new HashSet<>(currentMeetingDays);
                Set<String> meetingDays = Set.of(section.getMeetingDays().split("(?=\\p{Upper})"));
                currentMeetingDaysCopy.retainAll(meetingDays);

                // validate for time conflict in room's schedule
                if (currentMeetingDaysCopy.size() > 0) {
                    if (sectionDto.getMeetingTimeStart().isBefore(section.getMeetingTimeEnd().plusMinutes(10))
                            && section.getMeetingTimeStart().isBefore(sectionDto.getMeetingTimeEnd().plusMinutes(10))) {
                        Integer currentSectionNumber = currentSection != null
                                ? currentSection.getSectionNumber()
                                : sectionDto.getSectionNumber();
                        String currentSectionNumberHolder = currentSectionNumber != null
                                ? "." + String.format("%02d", currentSectionNumber)
                                : "";
                        throw new ValidationException("Schedule for room "
                                                              + room.getRoomNumber()
                                                              + " in building "
                                                              + room.getBuilding().getBuildingNumber()
                                                              + ": Time conflict for section "
                                                              + currentCourse.getCourseCode()
                                                              + currentSectionNumberHolder
                                                              + " and scheduled section "
                                                              + section.getCourse().getCourseCode() + "."
                                                              + String.format("%02d",
                                                                              section.getSectionNumber()) + "!");
                    }
                }
            }

            // validation for room's schedule is passed, set room for current section
            if (currentSection != null) {
                currentSection.setRoom(room);
            }
        }
    }
}