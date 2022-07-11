import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDeptComponent } from './staff-dept.component';

describe('StaffDeptComponent', () => {
  let component: StaffDeptComponent;
  let fixture: ComponentFixture<StaffDeptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffDeptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
