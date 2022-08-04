import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSixtyComponent } from './form-sixty.component';

describe('FormSixtyComponent', () => {
  let component: FormSixtyComponent;
  let fixture: ComponentFixture<FormSixtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSixtyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSixtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
