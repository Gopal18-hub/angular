import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HwcDialogComponent } from './hwc-dialog.component';

describe('HwcDialogComponent', () => {
  let component: HwcDialogComponent;
  let fixture: ComponentFixture<HwcDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HwcDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HwcDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
