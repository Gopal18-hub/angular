import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDischargeConsultationsComponent } from './post-discharge-consultations.component';

describe('PostDischargeConsultationsComponent', () => {
  let component: PostDischargeConsultationsComponent;
  let fixture: ComponentFixture<PostDischargeConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDischargeConsultationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDischargeConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
