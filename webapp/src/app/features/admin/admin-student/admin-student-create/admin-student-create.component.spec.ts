import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentCreateComponent } from './admin-student-create.component';

describe('AdminStudentCreateComponent', () => {
  let component: AdminStudentCreateComponent;
  let fixture: ComponentFixture<AdminStudentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStudentCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStudentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
