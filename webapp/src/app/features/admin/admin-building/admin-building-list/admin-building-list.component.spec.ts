import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildingListComponent } from './admin-building-list.component';

describe('AdminBuildingListComponent', () => {
  let component: AdminBuildingListComponent;
  let fixture: ComponentFixture<AdminBuildingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBuildingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
