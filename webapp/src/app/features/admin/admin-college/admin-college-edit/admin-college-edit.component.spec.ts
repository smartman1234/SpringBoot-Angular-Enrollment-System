import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCollegeEditComponent } from './admin-college-edit.component';

describe('AdminCollegeEditComponent', () => {
  let component: AdminCollegeEditComponent;
  let fixture: ComponentFixture<AdminCollegeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCollegeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCollegeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
