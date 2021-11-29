import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomEditComponent } from './admin-room-edit.component';

describe('AdminRoomEditComponent', () => {
  let component: AdminRoomEditComponent;
  let fixture: ComponentFixture<AdminRoomEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRoomEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
