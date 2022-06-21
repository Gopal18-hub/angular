import { Component, OnInit, Input} from '@angular/core';
import { environment } from "@environments/environment";

@Component({
  selector: 'empty-placeholder',
  templateUrl: './empty-placeholder.component.html',
  styleUrls: ['./empty-placeholder.component.scss']
})
export class EmptyPlaceholderComponent implements OnInit {

  @Input() defaultplaceholder: any;
  defaultmessage: string | undefined;

  constructor() { }

  ngOnInit(): void {
    this.defaultmessage = this.defaultplaceholder;
  }

}
