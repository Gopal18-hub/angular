import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstTaxDialogComponent } from './gst-tax-dialog.component';

describe('GstTaxDialogComponent', () => {
  let component: GstTaxDialogComponent;
  let fixture: ComponentFixture<GstTaxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstTaxDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GstTaxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
