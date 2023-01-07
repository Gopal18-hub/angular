import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderProcedureOtherComponent } from "./procedure-other.component";

describe("ProcedureOtherComponent", () => {
  let component: OrderProcedureOtherComponent;
  let fixture: ComponentFixture<OrderProcedureOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderProcedureOtherComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderProcedureOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
