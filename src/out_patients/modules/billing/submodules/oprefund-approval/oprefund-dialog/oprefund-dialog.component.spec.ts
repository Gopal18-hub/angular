import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OprefundDialogComponent } from './oprefund-dialog.component';

describe('OprefundDialogComponent', () => {
  let component: OprefundDialogComponent;
  let fixture: ComponentFixture<OprefundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OprefundDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OprefundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
