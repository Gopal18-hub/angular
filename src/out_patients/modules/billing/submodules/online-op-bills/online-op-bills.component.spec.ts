import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineOpBillsComponent } from './online-op-bills.component';

describe('OnlineOpBillsComponent', () => {
  let component: OnlineOpBillsComponent;
  let fixture: ComponentFixture<OnlineOpBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineOpBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineOpBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
