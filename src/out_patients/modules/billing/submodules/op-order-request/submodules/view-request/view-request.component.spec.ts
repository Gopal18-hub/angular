import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OPOrderViewRequest } from "./view-request.component";

describe("BillComponent", () => {
  let component: OPOrderViewRequest;
  let fixture: ComponentFixture<OPOrderViewRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OPOrderViewRequest],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPOrderViewRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
