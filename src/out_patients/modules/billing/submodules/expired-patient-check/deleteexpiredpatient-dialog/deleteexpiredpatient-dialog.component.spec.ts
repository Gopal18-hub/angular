import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteexpiredpatientDialogComponent } from './deleteexpiredpatient-dialog.component';

describe('DeleteexpiredpatientDialogComponent', () => {
  let component: DeleteexpiredpatientDialogComponent;
  let fixture: ComponentFixture<DeleteexpiredpatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteexpiredpatientDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteexpiredpatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
