import { AdminCourseQuery } from './admin-course.query';
import { AdminCourseStore } from './admin-course.store';

describe('AdminCourseQuery', () => {
  let query: AdminCourseQuery;

  beforeEach(() => {
    query = new AdminCourseQuery(new AdminCourseStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
