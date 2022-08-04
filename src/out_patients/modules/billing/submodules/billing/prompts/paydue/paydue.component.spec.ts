import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydueComponent } from './paydue.component';

describe('PaydueComponent', () => {
  let component: PaydueComponent;
  let fixture: ComponentFixture<PaydueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaydueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaydueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
