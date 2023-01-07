import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakedepositDialogComponent } from './makedeposit-dialog.component';

describe('MakedepositDialogComponent', () => {
  let component: MakedepositDialogComponent;
  let fixture: ComponentFixture<MakedepositDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakedepositDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakedepositDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
