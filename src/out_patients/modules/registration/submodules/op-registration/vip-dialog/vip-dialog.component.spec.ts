import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipDialogComponent } from './vip-dialog.component';

describe('VipDialogComponent', () => {
  let component: VipDialogComponent;
  let fixture: ComponentFixture<VipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
