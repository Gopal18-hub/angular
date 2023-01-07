import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchReportComponent } from './dispatch-report.component';

describe('DispatchReportComponent', () => {
  let component: DispatchReportComponent;
  let fixture: ComponentFixture<DispatchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
