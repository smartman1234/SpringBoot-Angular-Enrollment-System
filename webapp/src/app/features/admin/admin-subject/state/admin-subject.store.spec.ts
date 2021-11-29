import { AdminSubjectStore } from './admin-subject.store';

describe('AdminSubjectStore', () => {
  let store: AdminSubjectStore;

  beforeEach(() => {
    store = new AdminSubjectStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
