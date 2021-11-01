import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollWaitListDialogComponent } from './enroll-wait-list-dialog.component';

describe('EnrollWaitListDialogComponent', () => {
  let component: EnrollWaitListDialogComponent;
  let fixture: ComponentFixture<EnrollWaitListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollWaitListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollWaitListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
