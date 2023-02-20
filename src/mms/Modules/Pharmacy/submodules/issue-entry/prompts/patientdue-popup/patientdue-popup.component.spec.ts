import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientDuePopupComponent } from "./patientdue-popupcomponent";

describe("PatientDuePopupComponent", () => {
  let component: PatientDuePopupComponent;
  let fixture: ComponentFixture<PatientDuePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientDuePopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
