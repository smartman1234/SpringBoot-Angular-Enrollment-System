import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserPasswordChangeComponent } from './admin-user-password-change.component';

describe('AdminUserPasswordChangeComponent', () => {
  let component: AdminUserPasswordChangeComponent;
  let fixture: ComponentFixture<AdminUserPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUserPasswordChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
