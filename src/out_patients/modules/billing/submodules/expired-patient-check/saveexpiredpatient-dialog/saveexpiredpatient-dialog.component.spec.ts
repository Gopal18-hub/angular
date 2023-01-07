import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveexpiredpatientDialogComponent } from './saveexpiredpatient-dialog.component';

describe('SaveexpiredpatientDialogComponent', () => {
  let component: SaveexpiredpatientDialogComponent;
  let fixture: ComponentFixture<SaveexpiredpatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveexpiredpatientDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveexpiredpatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
