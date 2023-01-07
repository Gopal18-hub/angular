import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashScrollNewComponent } from './cash-scroll-new.component';

describe('CashScrollNewComponent', () => {
  let component: CashScrollNewComponent;
  let fixture: ComponentFixture<CashScrollNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashScrollNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashScrollNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
