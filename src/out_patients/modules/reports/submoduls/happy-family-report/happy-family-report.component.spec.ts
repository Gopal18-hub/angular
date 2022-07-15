import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyFamilyReportComponent } from './happy-family-report.component';

describe('HappyFamilyReportComponent', () => {
  let component: HappyFamilyReportComponent;
  let fixture: ComponentFixture<HappyFamilyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HappyFamilyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyFamilyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
