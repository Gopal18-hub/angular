import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotListingDialogComponent } from './hot-listing-dialog.component';

describe('HotListingDialogComponent', () => {
  let component: HotListingDialogComponent;
  let fixture: ComponentFixture<HotListingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotListingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotListingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
