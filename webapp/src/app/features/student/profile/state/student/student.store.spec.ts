import { StudentStore } from './student.store';

describe('StudentStore', () => {
  let store: StudentStore;

  beforeEach(() => {
    store = new StudentStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
