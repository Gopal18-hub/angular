import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintduereceiptComponent } from './printduereceipt.component';

describe('PrintduereceiptComponent', () => {
  let component: PrintduereceiptComponent;
  let fixture: ComponentFixture<PrintduereceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintduereceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintduereceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
