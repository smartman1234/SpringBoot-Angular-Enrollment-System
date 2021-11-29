import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuthorityEditComponent } from './admin-authority-edit.component';

describe('AdminAuthorityEditComponent', () => {
  let component: AdminAuthorityEditComponent;
  let fixture: ComponentFixture<AdminAuthorityEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAuthorityEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAuthorityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
