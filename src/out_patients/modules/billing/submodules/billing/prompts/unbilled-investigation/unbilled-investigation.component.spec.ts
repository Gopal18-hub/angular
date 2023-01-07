import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbilledInvestigationComponent } from './unbilled-investigation.component';

describe('UnbilledInvestigationComponent', () => {
  let component: UnbilledInvestigationComponent;
  let fixture: ComponentFixture<UnbilledInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnbilledInvestigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbilledInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
