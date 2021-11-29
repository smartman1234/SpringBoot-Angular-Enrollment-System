import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstructorEditComponent } from './admin-instructor-edit.component';

describe('AdminInstructorEditComponent', () => {
  let component: AdminInstructorEditComponent;
  let fixture: ComponentFixture<AdminInstructorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInstructorEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInstructorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
