import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureRisComponent } from './configure-ris.component';

describe('ConfigureRisComponent', () => {
  let component: ConfigureRisComponent;
  let fixture: ComponentFixture<ConfigureRisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureRisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureRisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
