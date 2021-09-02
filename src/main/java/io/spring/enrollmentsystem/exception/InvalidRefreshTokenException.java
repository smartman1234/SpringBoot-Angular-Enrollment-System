package io.spring.enrollmentsystem.exception;

public class InvalidRefreshTokenException extends RuntimeException{

    public InvalidRefreshTokenException() {
        super("Invalid or missing refresh token, please log in again!");
    }

    public InvalidRefreshTokenException(Throwable cause) {
        super("Invalid or missing refresh token, please log in again!", cause);
    }

    public InvalidRefreshTokenException(String message) {
        super(message);
    }

    public InvalidRefreshTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
