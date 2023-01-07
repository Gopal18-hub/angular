import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDischargeFollowUpBillingComponent } from './post-discharge-follow-up-billing.component';

describe('PostDischargeFollowUpBillingComponent', () => {
  let component: PostDischargeFollowUpBillingComponent;
  let fixture: ComponentFixture<PostDischargeFollowUpBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDischargeFollowUpBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDischargeFollowUpBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
