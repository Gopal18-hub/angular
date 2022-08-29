import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OderInvestigationsComponent } from "./investigations.component";

describe("OderInvestigationsComponent", () => {
  let component: OderInvestigationsComponent;
  let fixture: ComponentFixture<OderInvestigationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OderInvestigationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OderInvestigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
