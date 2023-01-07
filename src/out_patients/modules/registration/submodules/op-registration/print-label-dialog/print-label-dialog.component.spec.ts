import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLabelDialogComponent } from './print-label-dialog.component';

describe('PrintLabelDialogComponent', () => {
  let component: PrintLabelDialogComponent;
  let fixture: ComponentFixture<PrintLabelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintLabelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
