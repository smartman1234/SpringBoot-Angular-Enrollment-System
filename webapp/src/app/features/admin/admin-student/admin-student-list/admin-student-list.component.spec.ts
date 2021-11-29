import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentListComponent } from './admin-student-list.component';

describe('AdminStudentListComponent', () => {
  let component: AdminStudentListComponent;
  let fixture: ComponentFixture<AdminStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStudentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
