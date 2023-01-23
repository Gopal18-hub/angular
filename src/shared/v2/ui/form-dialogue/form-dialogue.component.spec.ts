import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogueComponent } from './form-dialogue.component';

describe('FormDialogueComponent', () => {
  let component: FormDialogueComponent;
  let fixture: ComponentFixture<FormDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
