package io.spring.enrollmentsystem.view;

public class UserView {
    public interface LoginRequest {
    }

    public interface LoginResponse extends BaseView.Id {
    }

    public interface Signup extends BaseView.Create {
    }
}
