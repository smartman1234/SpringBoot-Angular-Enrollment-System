import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuthorityListComponent } from './admin-authority-list.component';

describe('AdminAuthorityListComponent', () => {
  let component: AdminAuthorityListComponent;
  let fixture: ComponentFixture<AdminAuthorityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAuthorityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAuthorityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
