import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartmentEditComponent } from './admin-department-edit.component';

describe('AdminDepartmentEditComponent', () => {
  let component: AdminDepartmentEditComponent;
  let fixture: ComponentFixture<AdminDepartmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDepartmentEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDepartmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
