import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PartialCredBillComponent } from "./part-cred-bill-settlement.component";

describe("BillDetailComponent", () => {
  let component: PartialCredBillComponent;
  let fixture: ComponentFixture<PartialCredBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartialCredBillComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialCredBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
