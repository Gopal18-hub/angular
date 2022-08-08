import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MakeBillDialogComponent } from "./makebill-dialog.component";

describe("MakeBillDialogComponent", () => {
  let component: MakeBillDialogComponent;
  let fixture: ComponentFixture<MakeBillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MakeBillDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
