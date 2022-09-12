import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashScrollModifyComponent } from './cash-scroll-modify.component';

describe('CashScrollModifyComponent', () => {
  let component: CashScrollModifyComponent;
  let fixture: ComponentFixture<CashScrollModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashScrollModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashScrollModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
