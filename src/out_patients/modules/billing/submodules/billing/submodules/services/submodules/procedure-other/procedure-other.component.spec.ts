import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureOtherComponent } from './procedure-other.component';

describe('ProcedureOtherComponent', () => {
  let component: ProcedureOtherComponent;
  let fixture: ComponentFixture<ProcedureOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedureOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
