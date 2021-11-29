import { SubjectStore } from './subject.store';

describe('SubjectStore', () => {
  let store: SubjectStore;

  beforeEach(() => {
    store = new SubjectStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
