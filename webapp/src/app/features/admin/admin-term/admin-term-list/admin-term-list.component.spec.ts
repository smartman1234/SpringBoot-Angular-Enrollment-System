import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermListComponent } from './admin-term-list.component';

describe('AdminTermListComponent', () => {
  let component: AdminTermListComponent;
  let fixture: ComponentFixture<AdminTermListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTermListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
