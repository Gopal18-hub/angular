import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'maxhealth-sub-header',
  templateUrl: './sub.component.html',
  styleUrls: ['./sub.component.scss']
})
export class SubComponent implements OnInit {

  @Input() submodules: any;

  constructor() { }

  ngOnInit(): void {

    
  }

}
