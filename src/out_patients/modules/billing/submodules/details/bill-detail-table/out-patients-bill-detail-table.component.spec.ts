import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BillDetailTableComponent } from "./out-patients-bill-detail-table.component";

describe("BillDetailComponent", () => {
  let component: BillDetailTableComponent;
  let fixture: ComponentFixture<BillDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillDetailTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
