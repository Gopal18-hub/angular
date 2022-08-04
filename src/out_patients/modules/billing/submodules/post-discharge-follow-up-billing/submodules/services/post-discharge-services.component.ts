import { Component, OnInit } from '@angular/core';
import { ComponentPortal } from "@angular/cdk/portal";
import { PostDischargeConsultationsComponent } from './submodules/post-discharge-consultations/post-discharge-consultations.component';

@Component({
  selector: 'out-patients-post-discharge-services',
  templateUrl: './post-discharge-services.component.html',
  styleUrls: ['./post-discharge-services.component.scss']
})
export class PostDischargeServicesComponent implements OnInit {

  selectedComponent: ComponentPortal<any> = new ComponentPortal(
    PostDischargeConsultationsComponent
  );
  tabs: any = [
    {
      id: 1,
      title: "Consultations",
      component: PostDischargeConsultationsComponent,
    },
  ];

  activeTab: any = this.tabs[0];
  constructor() { }

  ngOnInit(): void {
  }
  // tabChange(tab: any) {
  //   this.activeTab = tab;
  //   this.selectedComponent = new ComponentPortal(tab.component);
  // }
}
