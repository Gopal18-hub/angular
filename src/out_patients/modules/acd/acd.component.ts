import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'out-patients-acd',
  templateUrl: './acd.component.html',
  styleUrls: ['./acd.component.scss']
})
export class AcdComponent implements OnInit {

  link1 = ["Investigation Orders", "Medicine Orders"];
  activeLink1 = this.link1[0];

  //New
  links = [
    {
      title: "Investigation Orders",
      path: "investigation-orders",
    },
    {
      title: "Medicine Orders",
      path: "medicine-orders",
    }
  ];
  activeLink = this.links[0];
  //New
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.activeLink.path === "investigation-orders")
      this.router.navigate(["acd", "investigation-orders"])
  }

}
