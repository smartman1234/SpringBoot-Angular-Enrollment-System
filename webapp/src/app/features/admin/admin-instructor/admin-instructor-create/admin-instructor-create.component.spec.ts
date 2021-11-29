import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstructorCreateComponent } from './admin-instructor-create.component';

describe('AdminInstructorCreateComponent', () => {
  let component: AdminInstructorCreateComponent;
  let fixture: ComponentFixture<AdminInstructorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInstructorCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInstructorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
