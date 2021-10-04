package io.spring.enrollmentsystem.feature.authentication;

public class InvalidAccessTokenException extends RuntimeException{

    public InvalidAccessTokenException() {
        super("Invalid or missing access token, please log in again!");
    }

    public InvalidAccessTokenException(Throwable cause) {
        super("Invalid or missing access token, please log in again!", cause);
    }

    public InvalidAccessTokenException(String message) {
        super(message);
    }

    public InvalidAccessTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
