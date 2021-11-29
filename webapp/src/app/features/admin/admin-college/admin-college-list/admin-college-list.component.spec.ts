import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCollegeListComponent } from './admin-college-list.component';

describe('AdminCollegeListComponent', () => {
  let component: AdminCollegeListComponent;
  let fixture: ComponentFixture<AdminCollegeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCollegeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCollegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
