import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmgDialogComponent } from './dmg-dialog.component';

describe('DmgDialogComponent', () => {
  let component: DmgDialogComponent;
  let fixture: ComponentFixture<DmgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmgDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
