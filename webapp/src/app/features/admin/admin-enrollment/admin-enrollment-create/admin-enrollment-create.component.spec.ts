import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollmentCreateComponent } from './admin-enrollment-create.component';

describe('AdminEnrollmentCreateComponent', () => {
  let component: AdminEnrollmentCreateComponent;
  let fixture: ComponentFixture<AdminEnrollmentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEnrollmentCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnrollmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
