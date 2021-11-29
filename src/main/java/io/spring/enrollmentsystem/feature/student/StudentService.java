package io.spring.enrollmentsystem.feature.student;

import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import io.spring.enrollmentsystem.common.service.PatchService;
import io.spring.enrollmentsystem.common.service.SpecificationService;
import io.spring.enrollmentsystem.feature.user.UserService;
import io.spring.enrollmentsystem.feature.user.User_;
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

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;

/**
 * (Student) service
 *
 * @author Khoale
 * @since 2021-09-02 (00:39:59)
 */
@Service
@Slf4j @RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final PatchService patchService;
    private final UserService userService;
    private final SpecificationService specificationService;

    @Transactional(readOnly = true)
    public Student getStudentById(UUID studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(Student.class, studentId));
    }

    @Transactional(readOnly = true)
    public Student getStudentWithListOfEnrollment(UUID studentId) {
        return studentRepository.findWithListOfEnrollmentById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(Student.class, studentId));
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentDtoById(UUID studentId) {
        return studentRepository.findById(StudentDto.class, studentId)
                .orElseThrow(() -> new ResourceNotFoundException(Student.class, studentId));
    }

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudentDtoByPredicate(MultiValueMap<String, String> parameters) {
        return studentRepository
                .findAll(StudentDto.class,
                         specificationService.getSpecifications(parameters),
                         Sort.by(Student_.USER + KEY_SEPARATOR + User_.LAST_NAME)
                                 .and(Sort.by(Student_.USER + KEY_SEPARATOR + User_.FIRST_NAME)));
    }

    @Transactional(readOnly = true)
    public Page<StudentDto> getStudentDtoPageableByPredicate(MultiValueMap<String, String> parameters,
                                                             Pageable pageable) {
        return studentRepository
                .findAll(StudentDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional(readOnly = true)
    public Slice<StudentDto> getStudentDtoSliceByPredicate(MultiValueMap<String, String> parameters,
                                                           Pageable pageable) {
        return studentRepository
                .findAllSlice(StudentDto.class, specificationService.getSpecifications(parameters), pageable);
    }

    @Transactional
    public StudentDto createStudent(StudentDto studentDto) {
        UUID userId = studentDto.getUserId();
        userService.getUserById(userId);
        if (studentRepository.existsById(userId)) {
            throw new ValidationException("Student with user id " + studentDto.getUserId() + " already exists!");
        }

        Student transientStudent = studentMapper.toStudent(studentDto);
        return studentMapper.toStudentDto(studentRepository.save(transientStudent));
    }

    @Transactional
    public StudentDto updateStudent(UUID studentId, StudentDto studentDto) {
        Student currentStudent = getStudentById(studentId);
        return studentMapper.toStudentDto(studentMapper.toExistingStudent(studentDto, currentStudent));
    }

    @Transactional
    public StudentDto patchStudent(UUID studentId, JsonMergePatch mergePatchDocument, Class<?> viewClass) {
        Student currentStudent = getStudentById(studentId);
        StudentDto currentStudentDto = studentMapper.toStudentDto(currentStudent);

        StudentDto patchedStudentDto = patchService.mergePatch(mergePatchDocument,
                                                               currentStudentDto,
                                                               StudentDto.class,
                                                               viewClass);

        return studentMapper.toStudentDto(studentMapper.toExistingStudent(patchedStudentDto, currentStudent));
    }

    @Transactional
    public void deleteById(UUID studentId) {
        if (studentRepository.existsById(studentId)) {
            studentRepository.deleteById(studentId);
        } else {
            throw new ResourceNotFoundException(Student.class, studentId);
        }
    }

}