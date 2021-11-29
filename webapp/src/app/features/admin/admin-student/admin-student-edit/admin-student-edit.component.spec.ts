import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentEditComponent } from './admin-student-edit.component';

describe('AdminStudentEditComponent', () => {
  let component: AdminStudentEditComponent;
  let fixture: ComponentFixture<AdminStudentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStudentEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
