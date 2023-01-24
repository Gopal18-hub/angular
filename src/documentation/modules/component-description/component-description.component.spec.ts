import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComponentdescriptionComponent } from "./component-description.component";

describe("ComponentdescriptionComponent", () => {
  let component: ComponentdescriptionComponent;
  let fixture: ComponentFixture<ComponentdescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentdescriptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentdescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
