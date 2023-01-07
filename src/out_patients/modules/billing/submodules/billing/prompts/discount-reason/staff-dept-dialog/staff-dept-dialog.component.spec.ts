import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDeptDialogComponent } from './staff-dept-dialog.component';

describe('StaffDeptDialogComponent', () => {
  let component: StaffDeptDialogComponent;
  let fixture: ComponentFixture<StaffDeptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffDeptDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDeptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
