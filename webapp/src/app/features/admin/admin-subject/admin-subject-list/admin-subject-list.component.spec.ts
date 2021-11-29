import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubjectListComponent } from './admin-subject-list.component';

describe('AdminSubjectListComponent', () => {
  let component: AdminSubjectListComponent;
  let fixture: ComponentFixture<AdminSubjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSubjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
