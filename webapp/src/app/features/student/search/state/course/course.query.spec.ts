import { CourseQuery } from './course.query';
import { CourseStore } from './course.store';

describe('CourseQuery', () => {
  let query: CourseQuery;

  beforeEach(() => {
    query = new CourseQuery(new CourseStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
