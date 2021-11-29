import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CourseService } from './course.service';
import { CourseStore } from './course.store';

describe('CourseService', () => {
  let courseService: CourseService;
  let courseStore: CourseStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseService, CourseStore],
      imports: [ HttpClientTestingModule ]
    });

    courseService = TestBed.inject(CourseService);
    courseStore = TestBed.inject(CourseStore);
  });

  it('should be created', () => {
    expect(courseService).toBeDefined();
  });

});
