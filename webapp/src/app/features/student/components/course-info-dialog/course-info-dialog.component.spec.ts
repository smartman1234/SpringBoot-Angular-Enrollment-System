import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseInfoDialogComponent } from './course-info-dialog.component';

describe('CourseInfoDialogComponent', () => {
  let component: CourseInfoDialogComponent;
  let fixture: ComponentFixture<CourseInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
