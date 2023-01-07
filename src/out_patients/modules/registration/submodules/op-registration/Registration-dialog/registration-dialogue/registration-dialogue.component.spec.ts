import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDialogueComponent } from './registration-dialogue.component';

describe('RegistrationDialogueComponent', () => {
  let component: RegistrationDialogueComponent;
  let fixture: ComponentFixture<RegistrationDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
