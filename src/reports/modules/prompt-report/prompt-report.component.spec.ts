import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptReportComponent } from './prompt-report.component';

describe('PromptReportComponent', () => {
  let component: PromptReportComponent;
  let fixture: ComponentFixture<PromptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromptReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
