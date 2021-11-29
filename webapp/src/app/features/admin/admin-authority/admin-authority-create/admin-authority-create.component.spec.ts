import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuthorityCreateComponent } from './admin-authority-create.component';

describe('AdminAuthorityCreateComponent', () => {
  let component: AdminAuthorityCreateComponent;
  let fixture: ComponentFixture<AdminAuthorityCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAuthorityCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAuthorityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
