import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCheckupsComponent } from './health-checkups.component';

describe('HealthCheckupsComponent', () => {
  let component: HealthCheckupsComponent;
  let fixture: ComponentFixture<HealthCheckupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthCheckupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCheckupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
