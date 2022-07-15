import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOpdScrollReportComponent } from './general-opd-scroll-report.component';

describe('GeneralOpdScrollReportComponent', () => {
  let component: GeneralOpdScrollReportComponent;
  let fixture: ComponentFixture<GeneralOpdScrollReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralOpdScrollReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralOpdScrollReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
