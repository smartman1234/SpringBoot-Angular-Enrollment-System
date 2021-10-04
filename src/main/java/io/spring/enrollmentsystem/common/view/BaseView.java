package io.spring.enrollmentsystem.common.view;

public class BaseView {

    // access to everything in dto
    public interface Private extends HighWithId {
    }

    // access to almost properties in dto including id
    public interface VeryHighWithId extends VeryHigh, Id {
    }

    // access to almost properties in dto
    public interface VeryHigh extends High {
    }

    // access to most properties in dto including id
    public interface HighWithId extends High, Id {
    }

    // access to most properties in dto
    public interface High extends Create {
    }

    // create does not need id
    public interface Create extends Medium {
    }

    // access to some properties in dto including id
    public interface MediumWithId extends Medium, Id {
    }

    // access to some properties in dto
    public interface Medium extends Update {
    }

    // exclude none updatable properties in dto
    public interface Update extends Low {
    }

    // access to few properties in dto including id
    public interface LowWithId extends Low, Id {
    }

    // access to few properties in dto
    public interface Low {
    }

    // access to only id in dto
    public interface Id {
    }

}
