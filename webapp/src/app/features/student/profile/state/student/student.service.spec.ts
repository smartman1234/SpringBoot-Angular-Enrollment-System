import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { StudentStore } from './student.store';

describe('StudentService', () => {
  let studentService: StudentService;
  let studentStore: StudentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentService, StudentStore],
      imports: [ HttpClientTestingModule ]
    });

    studentService = TestBed.inject(StudentService);
    studentStore = TestBed.inject(StudentStore);
  });

  it('should be created', () => {
    expect(studentService).toBeDefined();
  });

});
