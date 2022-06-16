import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotListingApprovalComponent } from './hot-listing-approval.component';

describe('HotListingApprovalComponent', () => {
  let component: HotListingApprovalComponent;
  let fixture: ComponentFixture<HotListingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotListingApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotListingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
