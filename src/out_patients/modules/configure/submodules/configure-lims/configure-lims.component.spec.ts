import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureLimsComponent } from './configure-lims.component';

describe('ConfigureLimsComponent', () => {
  let component: ConfigureLimsComponent;
  let fixture: ComponentFixture<ConfigureLimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureLimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureLimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
