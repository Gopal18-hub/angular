import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSponsorTaggingComponent } from './employee-sponsor-tagging.component';

describe('EmployeeSponsorTaggingComponent', () => {
  let component: EmployeeSponsorTaggingComponent;
  let fixture: ComponentFixture<EmployeeSponsorTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSponsorTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSponsorTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
