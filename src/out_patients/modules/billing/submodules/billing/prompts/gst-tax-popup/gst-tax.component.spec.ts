import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstTaxComponent } from './gst-tax.component';

describe('GstTaxComponent', () => {
  let component: GstTaxComponent;
  let fixture: ComponentFixture<GstTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GstTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
