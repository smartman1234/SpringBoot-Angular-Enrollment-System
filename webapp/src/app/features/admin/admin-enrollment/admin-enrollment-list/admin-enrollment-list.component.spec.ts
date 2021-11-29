import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollmentListComponent } from './admin-enrollment-list.component';

describe('AdminEnrollmentListComponent', () => {
  let component: AdminEnrollmentListComponent;
  let fixture: ComponentFixture<AdminEnrollmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEnrollmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnrollmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
