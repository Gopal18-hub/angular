import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpdepositCheckddDialogComponent } from './expdeposit-checkdd-dialog.component';

describe('ExpdepositCheckddDialogComponent', () => {
  let component: ExpdepositCheckddDialogComponent;
  let fixture: ComponentFixture<ExpdepositCheckddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpdepositCheckddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpdepositCheckddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
