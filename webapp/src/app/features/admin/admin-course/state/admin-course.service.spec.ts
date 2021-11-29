import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminCourseService } from './admin-course.service';
import { AdminCourseStore } from './admin-course.store';

describe('AdminCourseService', () => {
  let adminCourseService: AdminCourseService;
  let adminCourseStore: AdminCourseStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminCourseService, AdminCourseStore],
      imports: [ HttpClientTestingModule ]
    });

    adminCourseService = TestBed.inject(AdminCourseService);
    adminCourseStore = TestBed.inject(AdminCourseStore);
  });

  it('should be created', () => {
    expect(adminCourseService).toBeDefined();
  });

});
