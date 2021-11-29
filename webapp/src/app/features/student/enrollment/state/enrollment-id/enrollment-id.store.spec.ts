import { EnrollmentIdStore } from './enrollment-id.store';

describe('EnrollmentIdStore', () => {
  let store: EnrollmentIdStore;

  beforeEach(() => {
    store = new EnrollmentIdStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
