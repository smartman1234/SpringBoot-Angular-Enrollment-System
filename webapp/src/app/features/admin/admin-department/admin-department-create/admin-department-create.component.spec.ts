import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartmentCreateComponent } from './admin-department-create.component';

describe('AdminDepartmentCreateComponent', () => {
  let component: AdminDepartmentCreateComponent;
  let fixture: ComponentFixture<AdminDepartmentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDepartmentCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDepartmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
