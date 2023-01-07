import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpPrescriptionDialogComponent } from './op-prescription-dialog.component';

describe('OpPrescriptionDialogComponent', () => {
  let component: OpPrescriptionDialogComponent;
  let fixture: ComponentFixture<OpPrescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpPrescriptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpPrescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
