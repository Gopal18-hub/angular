import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSetDetailsComponent } from './order-set-details.component';

describe('OrderSetDetailsComponent', () => {
  let component: OrderSetDetailsComponent;
  let fixture: ComponentFixture<OrderSetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
