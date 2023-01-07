import { Component, OnInit, Input} from '@angular/core';
import { environment } from "@environments/environment";
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

const placeholderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="112.471" height="88.473" viewBox="0 0 112.471 88.473">
<g id="Group_543" data-name="Group 543" transform="translate(-495.274 -432.96)">
  <ellipse id="Ellipse_48" data-name="Ellipse 48" cx="8" cy="8.5" rx="8" ry="8.5" transform="translate(495.274 432.96)" fill="#ababab"/>
  <rect id="Rectangle_249" data-name="Rectangle 249" width="63" height="17" rx="8.5" transform="translate(519.274 432.96)" fill="#ababab"/>
  <ellipse id="Ellipse_48-2" data-name="Ellipse 48" cx="8" cy="8.5" rx="8" ry="8.5" transform="translate(495.274 457.96)" fill="#ababab"/>
  <rect id="Rectangle_249-2" data-name="Rectangle 249" width="62" height="17" rx="8.5" transform="translate(519.274 457.96)" fill="#ababab"/>
  <circle id="Ellipse_48-3" data-name="Ellipse 48" cx="8" cy="8" r="8" transform="translate(495.274 483.96)" fill="#ababab"/>
  <rect id="Rectangle_249-3" data-name="Rectangle 249" width="43" height="16" rx="8" transform="translate(519.274 483.96)" fill="#ababab"/>
  <path id="Union_18" data-name="Union 18" d="M12.813,47.092V28.914a14.437,14.437,0,1,1,3.245,0V47.092a1.623,1.623,0,1,1-3.245,0ZM3.244,14.5A11.192,11.192,0,1,0,14.437,3.259,11.231,11.231,0,0,0,3.244,14.5Z" transform="translate(552.878 486.981) rotate(-45)" fill="#707070"/>
</g>
</svg> 
`;

const norecordfoundIcon =  `<svg class="svg-icon" style="color:red; width: 4em; height: 5em;vertical-align: middle;fill: currentColor;overflow: hidden; margin-left:33%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 85.333333a426.666667 426.666667 0 1 0 426.666667 426.666667A426.666667 426.666667 0 0 0 512 85.333333z m0 768a341.333333 341.333333 0 1 1 341.333333-341.333333 341.333333 341.333333 0 0 1-341.333333 341.333333z"  /><path d="M512 682.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z"  />
<path d="M512 298.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v213.333334a42.666667 42.666667 0 0 0 85.333334 0V341.333333a42.666667 42.666667 0 0 0-42.666667-42.666666z"  />
</svg>
`;

@Component({
  selector: 'empty-placeholder',
  templateUrl: './empty-placeholder.component.html',
  styleUrls: ['./empty-placeholder.component.scss']
})


export class EmptyPlaceholderComponent implements OnInit {

  @Input() icon: any;
  @Input() message: any;

  Maxmessage: string | undefined;
  displayImageInfo: any = [];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIconLiteral("placeholder",  sanitizer.bypassSecurityTrustHtml(placeholderIcon));
    iconRegistry.addSvgIconLiteral("norecordfound", sanitizer.bypassSecurityTrustHtml(norecordfoundIcon));
  }

  ngOnInit(): void {
    this.Maxmessage = this.message;  
    this.displayImageInfo = this.icon; 
  }

}
