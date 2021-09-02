package io.spring.enrollmentsystem.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.io.IOException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidAccessTokenException.class)
    public void handleInvalidAccessTokenException(HttpServletRequest request,
                                                  HttpServletResponse response,
                                                  Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.UNAUTHORIZED, ex);
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public void handleInvalidRefreshTokenException(HttpServletRequest request,
                                                   HttpServletResponse response,
                                                   Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.UNAUTHORIZED, ex);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public void handleResourceNotFoundException(HttpServletRequest request,
                                                HttpServletResponse response,
                                                Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.NOT_FOUND, ex);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public void handleConstraintViolationException(HttpServletRequest request,
                                                   HttpServletResponse response,
                                                   Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public void handleMethodArgumentNotValidException(HttpServletRequest request,
                                                      HttpServletResponse response,
                                                      Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(InvalidFormatException.class)
    public void handleInvalidFormatException(HttpServletRequest request,
                                             HttpServletResponse response,
                                             Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(ValidationException.class)
    public void handleValidationException(HttpServletRequest request,
                                          HttpServletResponse response,
                                          Exception ex) throws Exception {
        handleExceptionInternal(request, response, HttpStatus.BAD_REQUEST, ex);
    }

    private void handleExceptionInternal(HttpServletRequest request, HttpServletResponse response,
                                         HttpStatus status, Exception ex) throws IOException {
        handleExceptionInternal(request, response, status, "", ex);
    }

    private void handleExceptionInternal(HttpServletRequest request, HttpServletResponse response,
                                         HttpStatus status, String extraMessage,
                                         Exception ex) throws IOException {
        log.error(ex.getClass().getName() + "- {} - {}", ex.getMessage(), request.getRequestURI());

        if (extraMessage.length() > 0) {
            response.sendError(status.value(), extraMessage);
            return;
        }

        response.sendError(status.value(), ex.getMessage());
    }
}
