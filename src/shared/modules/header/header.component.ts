import { Component, OnInit } from '@angular/core';
import { MaxModules } from '../../constants/Modules';
@Component({
  selector: 'maxhealth-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  modules: any  = [];
 
  constructor() { }

  ngOnInit(): void {
      this.modules = MaxModules.getModules();
  }
 

}
