import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientImageUploadDialogComponent } from './patient-image-upload-dialog.component';

describe('PatientImageUploadDialogComponent', () => {
  let component: PatientImageUploadDialogComponent;
  let fixture: ComponentFixture<PatientImageUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientImageUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientImageUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
