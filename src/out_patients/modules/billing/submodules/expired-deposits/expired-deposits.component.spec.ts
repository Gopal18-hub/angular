import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredDepositsComponent } from './expired-deposits.component';

describe('ExpiredDepositsComponent', () => {
  let component: ExpiredDepositsComponent;
  let fixture: ComponentFixture<ExpiredDepositsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredDepositsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
