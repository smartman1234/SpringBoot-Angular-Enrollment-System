package io.spring.enrollmentsystem.common.view;

public class AdminView {
    // access to everything in dto
    public interface AdminPrivate extends BaseView.Private {
    }

    // access to almost properties in dto including id
    public interface AdminVeryHighWithId extends AdminVeryHigh, BaseView.Id {
    }

    // access to almost properties in dto
    public interface AdminVeryHigh extends AdminHigh, BaseView.VeryHigh {
    }

    // access to most properties in dto including id
    public interface AdminHighWithId extends AdminHigh, BaseView.Id {
    }

    // access to most properties in dto
    public interface AdminHigh extends AdminCreate, BaseView.High {
    }

    // create does not need id
    public interface AdminCreate extends AdminMedium {
    }

    // access to some properties in dto including id
    public interface AdminMediumWithId extends AdminMedium, BaseView.Id {
    }

    // access to some properties in dto
    public interface AdminMedium extends AdminUpdate, BaseView.Medium {
    }

    // exclude none updatable properties in dto
    public interface AdminUpdate extends AdminLow {
    }

    // access to few properties in dto including id
    public interface AdminLowWithId extends AdminLow, BaseView.Id {
    }

    // access to few properties in dto
    public interface AdminLow extends BaseView.Low {
    }
}
