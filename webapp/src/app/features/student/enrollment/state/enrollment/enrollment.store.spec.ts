import { EnrollmentStore } from './enrollment.store';

describe('EnrollmentStore', () => {
  let store: EnrollmentStore;

  beforeEach(() => {
    store = new EnrollmentStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
