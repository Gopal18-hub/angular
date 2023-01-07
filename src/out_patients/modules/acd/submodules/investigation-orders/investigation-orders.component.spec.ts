import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationOrdersComponent } from './investigation-orders.component';

describe('InvestigationOrdersComponent', () => {
  let component: InvestigationOrdersComponent;
  let fixture: ComponentFixture<InvestigationOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
