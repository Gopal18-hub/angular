import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDischargeCreditDetailsComponent } from './post-discharge-credit-details.component';

describe('PostDischargeCreditDetailsComponent', () => {
  let component: PostDischargeCreditDetailsComponent;
  let fixture: ComponentFixture<PostDischargeCreditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDischargeCreditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDischargeCreditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
