package io.spring.enrollmentsystem.feature.course;

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

import javax.validation.ValidationException;
import java.util.List;
import java.util.UUID;

/**
 * (Course) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:58)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final PatchService patchService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Course getCourseById(UUID courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId));
    }

    @Transactional(readOnly = true)
    public CourseDto getCourseDtoById(UUID courseId) {
        return courseMapper.toCourseDto(getCourseById(courseId));
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourseDtoByPredicate(MultiValueMap<String, String> parameters) {
        return courseRepository
                .findAll(CourseDto.class,
                         specificationService.getSpecifications(parameters),
                         Sort.by(Course_.COURSE_CODE));
    }

    @Transactional(readOnly = true)
    public Page<CourseDto> getCourseDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                           Pageable pageable) {
        return courseRepository
                .findAll(CourseDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<CourseDto> getCourseDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                         Pageable pageable) {
        return courseRepository
                .findAllSlice(CourseDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public CourseDto createCourse(CourseDto courseDto) {
        validateCourseDto(courseDto, null);
        Course transientCourse = courseMapper.toCourse(courseDto);
        return courseMapper.toCourseDto(courseRepository.save(transientCourse));
    }

    @Transactional
    public CourseDto updateCourse(UUID courseId, CourseDto courseDto) {
        Course currentCourse = getCourseById(courseId);

        // additional validation and business logic processing before applying update properties
        validateCourseDto(courseDto, currentCourse);

        return courseMapper.toCourseDto(courseMapper.toExistingCourse(courseDto, currentCourse));
    }

    @Transactional
    public CourseDto patchCourse(UUID courseId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Course currentCourse = getCourseById(courseId);
        CourseDto currentCourseDto = courseMapper.toCourseDto(currentCourse);

        CourseDto patchedCourseDto = patchService.mergePatch(mergePatchDocument,
                                                             currentCourseDto,
                                                             CourseDto.class,
                                                             viewClass);

        // additional validation and business logic processing before applying patch properties
        validateCourseDto(patchedCourseDto, currentCourse);

        return courseMapper.toCourseDto(courseMapper.toExistingCourse(patchedCourseDto, currentCourse));
    }

    @Transactional
    public void deleteById(UUID courseId) {
        if (courseRepository.existsById(courseId)) {
            courseRepository.deleteById(courseId);
        } else {
            throw new ResourceNotFoundException(Course.class, courseId);
        }
    }

    private void validateCourseDto(CourseDto courseDto, Course course) {
        if (course == null || (courseDto.getCourseCode() != null &&
                !courseDto.getCourseCode().equals(course.getCourseCode()))) {
            if (courseRepository.existsByCourseCode(courseDto.getCourseCode())) {
                throw new ValidationException("Course code already exists!");
            }
        }
    }

}