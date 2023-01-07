import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CghsReasonComponent } from './cghs-reason.component';

describe('CghsReasonComponent', () => {
  let component: CghsReasonComponent;
  let fixture: ComponentFixture<CghsReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CghsReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CghsReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
