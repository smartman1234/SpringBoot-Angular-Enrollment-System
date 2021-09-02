package io.spring.enrollmentsystem.view;

public class AdminView {
    // access to everything in dto
    public interface Private extends BaseView.Private {
    }

    // access to most properties in dto including id
    public interface HighWithId extends AdminView.High, BaseView.Id {
    }

    // access to most properties in dto
    public interface High extends AdminView.Create, BaseView.High {
    }

    // create does not need id
    public interface Create extends AdminView.Medium {
    }

    // access to some properties in dto including id
    public interface MediumWithId extends AdminView.Medium, BaseView.Id {
    }

    // access to some properties in dto
    public interface Medium extends AdminView.Update, BaseView.Medium {
    }

    // exclude none updatable properties in dto
    public interface Update extends AdminView.Low {
    }

    // access to few properties in dto including id
    public interface LowWithId extends AdminView.Low, BaseView.Id {
    }

    // access to few properties in dto
    public interface Low extends BaseView.Low {
    }
}
