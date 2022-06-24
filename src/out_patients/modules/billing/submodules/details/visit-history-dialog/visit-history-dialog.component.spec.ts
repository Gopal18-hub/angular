import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitHistoryDialogComponent } from './visit-history-dialog.component';

describe('VisitHistoryDialogComponent', () => {
  let component: VisitHistoryDialogComponent;
  let fixture: ComponentFixture<VisitHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitHistoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
