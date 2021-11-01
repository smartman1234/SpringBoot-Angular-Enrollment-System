package io.spring.enrollmentsystem.feature.enrollment;

import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import io.spring.enrollmentsystem.feature.course.Course;
import io.spring.enrollmentsystem.feature.section.Section;
import io.spring.enrollmentsystem.feature.section.SectionService;
import io.spring.enrollmentsystem.feature.student.Student;
import io.spring.enrollmentsystem.feature.student.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;

import javax.validation.ValidationException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static io.spring.enrollmentsystem.feature.enrollment.EnrollmentStatus.ENROLLED;
import static io.spring.enrollmentsystem.feature.enrollment.EnrollmentStatus.IN_CART;
import static io.spring.enrollmentsystem.feature.enrollment.EnrollmentStatus.ON_WAIT_LIST;
import static io.spring.enrollmentsystem.feature.section.SectionStatus.CLOSED;
import static io.spring.enrollmentsystem.feature.section.SectionStatus.OPEN;
import static io.spring.enrollmentsystem.feature.section.SectionStatus.WAIT_LIST;

/**
 * (Enrollment) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final StudentService studentService;
    private final SectionService sectionService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Enrollment getEnrollmentByCompositeId(UUID studentId, UUID sectionId) {
        return enrollmentRepository.findById_StudentIdAndId_SectionId(studentId, sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(Enrollment.class, Student.class,
                                                                 studentId, Section.class, sectionId));
    }

    @Transactional(readOnly = true)
    public EnrollmentDto getEnrollmentDtoByCompositeId(UUID studentId, UUID sectionId) {
        return enrollmentRepository.findById(EnrollmentDto.class, new EnrollmentId(studentId, sectionId))
                .orElseThrow(() -> new ResourceNotFoundException(Enrollment.class, Student.class,
                                                                 studentId, Section.class, sectionId));
    }

    @Transactional(readOnly = true)
    public List<EnrollmentIdDto> getAllEnrollmentIdDtoByPredicate(MultiValueMap<String, String> parameters) {
        return enrollmentRepository
                .findAll(EnrollmentIdDto.class, specificationService.getSpecifications(parameters));
    }

    @Transactional(readOnly = true)
    public List<EnrollmentDto> getAllEnrollmentDtoByPredicate(MultiValueMap<String, String> parameters) {
        return enrollmentRepository
                .findAll(EnrollmentDto.class, specificationService.getSpecifications(parameters));
    }

    @Transactional(readOnly = true)
    public Page<EnrollmentDto> getEnrollmentDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                                   Pageable pageable) {
        return enrollmentRepository
                .findAll(EnrollmentDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<EnrollmentDto> getEnrollmentDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                                 Pageable pageable) {
        return enrollmentRepository
                .findAllSlice(EnrollmentDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public EnrollmentDto addEnrollmentToCart(EnrollmentDto enrollmentDto) {
        UUID studentId = enrollmentDto.getStudentId();
        UUID sectionId = enrollmentDto.getSectionId();
        // check if section is already registered or added to cart
        if (enrollmentRepository.existsById_StudentIdAndId_SectionId(studentId, sectionId)) {
            throw new ValidationException("Section is already registered or added to cart!");
        }

        Enrollment transientEnrollment = enrollmentMapper.toEnrollment(enrollmentDto);
        transientEnrollment.setEnrollmentStatus(IN_CART.status());

        return enrollmentMapper.toEnrollmentDto(enrollmentRepository.save(transientEnrollment));
    }

    @Transactional
    public EnrollmentDto enrollFromCartOrWaitingList(UUID studentId, UUID sectionId, @Nullable String accessCode) {
        Enrollment currentEnrollment = getEnrollmentByCompositeId(studentId, sectionId);

        // if current enrollment is on waiting list status, check for access code
        if (currentEnrollment.getEnrollmentStatus().equals(ON_WAIT_LIST.status())) {
            if (currentEnrollment.getAccessCode() == null
                    || !currentEnrollment.getAccessCode().equals(accessCode)) {
                throw new ValidationException("Access code is not valid!");
            }
            currentEnrollment.setEnrollmentStatus(ENROLLED.status());
            currentEnrollment.setAccessCode(null);

            return enrollmentMapper.toEnrollmentDto(currentEnrollment);
        }

        Section currentSection = sectionService.getSectionWithCourseAndTermById(sectionId);
        UUID currentTermId = currentSection.getTerm().getId();
        Course currentCourse = currentSection.getCourse();
        String currentCourseCode = currentCourse.getCourseCode();
        String currentSectionCode = currentCourseCode + "."
                + String.format("%02d", currentSection.getSectionNumber());

        // check if section is already registered or added to cart
        if (!currentEnrollment.getEnrollmentStatus().equals(IN_CART.status())) {
            throw new ValidationException("Section " + currentSectionCode + " is already enrolled or on wait list!");
        }

        // check if section is closed
        if (currentSection.getSectionStatus().equals(CLOSED.status())) {
            throw new ValidationException("Section " + currentSectionCode + " is closed!");
        }

        // check if section date is still valid for registering (10 days after section start date)
        LocalDate currentDate = LocalDate.now();
        if (currentDate.isBefore(currentSection.getDateStart().plusDays(15).minusMonths(4))
                && currentDate.isAfter(currentSection.getDateStart().plusDays(15))) {
            throw new ValidationException("Section " + currentSectionCode + " is not open for registering.");
        }

        boolean scheduleCheck = true;

        if (currentSection.getMeetingDays() == null
                || currentSection.getMeetingTimeStart() == null
                || currentSection.getMeetingTimeEnd() == null) {
            scheduleCheck = false;
        }

        if (scheduleCheck) {
            Set<String> currentMeetingDays = new HashSet<>(
                    Set.of(currentSection.getMeetingDays().split("(?=\\p{Upper})")));

            Student student = studentService.getStudentWithListOfEnrollment(studentId);

            // additional validation
            int accumulativeUnit = 0;
            for (Enrollment enrollment : student.getListOfEnrollment()) {
                // skip validation if enrollment is still in cart
                if (enrollment.getEnrollmentStatus().equals(IN_CART.status())) {
                    continue;
                }

                Section section = enrollment.getSection();
                if (!section.getTerm().getId().equals(currentTermId)
                        || section.getMeetingDays() == null
                        || section.getMeetingTimeStart() == null
                        || section.getMeetingTimeEnd() == null) {
                    continue;
                }
                Course course = section.getCourse();
                String courseCode = course.getCourseCode();
                String sectionCode = courseCode + "." + String.format("%02d", section.getSectionNumber());
                accumulativeUnit += course.getCourseUnit();

                // check for duplicate sections enrolling for one course
                if (currentCourseCode.equals(courseCode)) {
                    throw new ValidationException("Course " + currentCourseCode
                                                          + " is already registered by section " + sectionCode + "!");
                }

                Set<String> currentMeetingDaysCopy = new HashSet<>(currentMeetingDays);
                Set<String> meetingDays = Set.of(section.getMeetingDays().split("(?=\\p{Upper})"));
                currentMeetingDaysCopy.retainAll(meetingDays);

                // validate for time conflict in schedule
                if (currentMeetingDaysCopy.size() > 0) {
                    if (currentSection.getMeetingTimeStart().isBefore(section.getMeetingTimeEnd().plusMinutes(10))
                            && section.getMeetingTimeStart().isBefore(
                            currentSection.getMeetingTimeEnd().plusMinutes(10))) {
                        throw new ValidationException("Time conflict for section " + currentSectionCode
                                                              + " and enrolled section " + sectionCode + "!");
                    }
                }
            }

            accumulativeUnit += currentCourse.getCourseUnit();
            if (accumulativeUnit > student.getMaxUnit()) {
                throw new ValidationException("Unit cap (" + student.getMaxUnit() + " units) is reached!");
            }
        }

        // decide if student is allowed to enroll or to be put on wait list
        if (scheduleCheck && (currentSection.getEnrolledNumber() < currentSection.getClassCapacity())) {
            // change section to wait list status if the enrolling student is the last one of class capacity
            if (currentSection.getEnrolledNumber() + 1 >= currentSection.getClassCapacity()) {
                currentSection.setSectionStatus(WAIT_LIST.status());
            }
            currentSection.setEnrolledNumber(currentSection.getEnrolledNumber() + 1);
            currentEnrollment.setEnrollmentStatus(ENROLLED.status());
        } else if (currentSection.getWaitingNumber() < currentSection.getWaitlistCapacity()) {
            // close section if the enrolling student is the last one of section wait list
            if (currentSection.getWaitingNumber() + 1 >= currentSection.getWaitlistCapacity()) {
                currentSection.setSectionStatus(CLOSED.status());
            }
            currentSection.setWaitingNumber(currentSection.getWaitingNumber() + 1);
            currentEnrollment.setEnrollmentStatus(ON_WAIT_LIST.status());
            currentEnrollment.setAccessCode(UUID.randomUUID().toString());
        } else {
            // throw exception if both class capacity and wait list are full
            throw new ValidationException("Section " + currentSectionCode + " is closed!");
        }

        return enrollmentMapper.toEnrollmentDto(currentEnrollment);
    }

    @Transactional
    public void deleteByCompositeId(UUID studentId, UUID sectionId) {
        if (enrollmentRepository.existsById_StudentIdAndId_SectionId(studentId, sectionId)) {
            Section currentSection = sectionService.getSectionById(sectionId);
            if (currentSection.getSectionStatus().equals(CLOSED.status())) {
                currentSection.setWaitingNumber(currentSection.getWaitingNumber() - 1);
                currentSection.setSectionStatus(WAIT_LIST.status());
            } else if (currentSection.getSectionStatus().equals(WAIT_LIST.status())) {
                if (currentSection.getWaitingNumber() > 0) {
                    currentSection.setWaitingNumber(currentSection.getWaitingNumber() - 1);
                } else {
                    currentSection.setEnrolledNumber(currentSection.getEnrolledNumber() - 1);
                    currentSection.setSectionStatus(OPEN.status());
                }
            }
            enrollmentRepository.deleteById_StudentIdAndId_SectionId(studentId, sectionId);
        } else {
            throw new ResourceNotFoundException(Enrollment.class, Student.class, studentId, Section.class, sectionId);
        }
    }

}