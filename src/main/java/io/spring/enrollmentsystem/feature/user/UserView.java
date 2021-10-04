package io.spring.enrollmentsystem.feature.user;

import io.spring.enrollmentsystem.common.view.BaseView;

public class UserView {
    public interface LoginRequest {
    }

    public interface LoginResponse extends BaseView.Id {
    }

    public interface Signup extends BaseView.Create {
    }
}
