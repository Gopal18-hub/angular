import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ClearExistingLoginDialogComponent } from "./clear-existing-login-dialog.component";

describe("ClearExistingLoginDialogComponent", () => {
  let component: ClearExistingLoginDialogComponent;
  let fixture: ComponentFixture<ClearExistingLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClearExistingLoginDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearExistingLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
