import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDoctorModificationComponent } from './package-doctor-modification.component';

describe('PackageDoctorModificationComponent', () => {
  let component: PackageDoctorModificationComponent;
  let fixture: ComponentFixture<PackageDoctorModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageDoctorModificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDoctorModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
