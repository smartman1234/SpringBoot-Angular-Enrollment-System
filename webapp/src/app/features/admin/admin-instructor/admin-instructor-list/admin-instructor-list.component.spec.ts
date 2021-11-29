import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstructorListComponent } from './admin-instructor-list.component';

describe('AdminInstructorListComponent', () => {
  let component: AdminInstructorListComponent;
  let fixture: ComponentFixture<AdminInstructorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInstructorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInstructorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
