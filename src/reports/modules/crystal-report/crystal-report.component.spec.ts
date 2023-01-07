import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrystalReportComponent } from './crystal-report.component';

describe('CrystalReportComponent', () => {
  let component: CrystalReportComponent;
  let fixture: ComponentFixture<CrystalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrystalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrystalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
