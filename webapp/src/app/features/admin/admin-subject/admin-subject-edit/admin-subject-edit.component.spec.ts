import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubjectEditComponent } from './admin-subject-edit.component';

describe('AdminSubjectEditComponent', () => {
  let component: AdminSubjectEditComponent;
  let fixture: ComponentFixture<AdminSubjectEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSubjectEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubjectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
