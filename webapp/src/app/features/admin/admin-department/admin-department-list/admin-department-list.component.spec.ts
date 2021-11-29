import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartmentListComponent } from './admin-department-list.component';

describe('AdminDepartmentListComponent', () => {
  let component: AdminDepartmentListComponent;
  let fixture: ComponentFixture<AdminDepartmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDepartmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDepartmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
