import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCollegeCreateComponent } from './admin-college-create.component';

describe('AdminCollegeCreateComponent', () => {
  let component: AdminCollegeCreateComponent;
  let fixture: ComponentFixture<AdminCollegeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCollegeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCollegeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
