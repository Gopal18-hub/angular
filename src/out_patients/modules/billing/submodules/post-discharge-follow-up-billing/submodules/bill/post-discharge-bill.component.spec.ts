import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDischargeBillComponent } from './post-discharge-bill.component';

describe('PostDischargeBillComponent', () => {
  let component: PostDischargeBillComponent;
  let fixture: ComponentFixture<PostDischargeBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDischargeBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDischargeBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
