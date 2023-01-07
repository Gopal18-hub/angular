import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscCreditDetailsComponent } from './misc-credit-details.component';

describe('MiscCreditDetailsComponent', () => {
  let component: MiscCreditDetailsComponent;
  let fixture: ComponentFixture<MiscCreditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscCreditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscCreditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
