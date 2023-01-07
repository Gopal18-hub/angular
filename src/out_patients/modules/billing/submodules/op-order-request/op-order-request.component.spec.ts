import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpOrderRequestComponent } from './op-order-request.component';

describe('OpOrderRequestComponent', () => {
  let component: OpOrderRequestComponent;
  let fixture: ComponentFixture<OpOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpOrderRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
