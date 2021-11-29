import { CourseStore } from './course.store';

describe('CourseStore', () => {
  let store: CourseStore;

  beforeEach(() => {
    store = new CourseStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
