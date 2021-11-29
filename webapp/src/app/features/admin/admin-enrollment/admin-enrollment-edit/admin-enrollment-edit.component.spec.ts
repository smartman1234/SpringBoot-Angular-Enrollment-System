import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollmentEditComponent } from './admin-enrollment-edit.component';

describe('AdminEnrollmentEditComponent', () => {
  let component: AdminEnrollmentEditComponent;
  let fixture: ComponentFixture<AdminEnrollmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEnrollmentEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnrollmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
