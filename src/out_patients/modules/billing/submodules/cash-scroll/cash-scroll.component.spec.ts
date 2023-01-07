import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashScrollComponent } from './cash-scroll.component';

describe('CashScrollComponent', () => {
  let component: CashScrollComponent;
  let fixture: ComponentFixture<CashScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
