import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ComponentService {
  componentName: any = [];
  component = new Subject<any>();
  constructor() {}
}
