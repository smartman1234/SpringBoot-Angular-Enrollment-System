import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourseEditComponent } from './admin-course-edit.component';

describe('AdminCourseEditComponent', () => {
  let component: AdminCourseEditComponent;
  let fixture: ComponentFixture<AdminCourseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCourseEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCourseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
