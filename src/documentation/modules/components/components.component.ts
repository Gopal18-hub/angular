import { Component, OnInit } from "@angular/core";
import { ComponentService } from "../components/component.service";
@Component({
  selector: "out-patients-components",
  templateUrl: "./components.component.html",
  styleUrls: ["./components.component.scss"],
})
export class ComponentsComponent implements OnInit {
  menuContent: any = [];
  public clickedItem: string = "";
  constructor(public componentService: ComponentService) {}

  ngOnInit(): void {
    this.menuContent = [
      { label: "Autocomplete", caption: "Autocomplete" },
      { label: "Badge", caption: "Badge" },
      { label: "Bottom sheet", caption: "Bottom sheet" },
      { label: "Button", caption: "Button" },
      { label: "Button toggle", caption: "Button toggle" },
      { label: "Card", caption: "Card" },
      { label: "Checkbox", caption: "Checkbox" },
      { label: "Chips", caption: "Chips" },
      { label: "Core", caption: "Core" },
      { label: "Datepicker", caption: "Datepicker" },
      { label: "Dialog", caption: "Dialog" },
      { label: "Divider", caption: "Divider" },
      { label: "Expansion Panel", caption: "Expansion Panel" },
      { label: "Form Field", caption: "Form Field" },
      { label: "Grid list", caption: "Grid list" },
      { label: "Icon", caption: "Icon" },
      { label: "Input", caption: "Input Text Field" },
      { label: "List", caption: "List" },
      { label: "Menu", caption: "Menu" },
      { label: "Paginator", caption: "Paginator" },
      { label: "Progress bar", caption: "Progress bar" },
      { label: "Progress Spinner", caption: "Progress Spinner" },
      { label: "Radio button", caption: "Radio button" },
      { label: "Ripples", caption: "Ripples" },
      { label: "Select", caption: "Select" },
      { label: "Sidenav", caption: "Sidenav" },
      { label: "Slide Toggle", caption: "Slide Toggle" },
      { label: "Slider", caption: "Slider" },
      { label: "Snackbar", caption: "Snackbar" },
      { label: "Sort header", caption: "Sort header" },
      { label: "Stepper", caption: "Stepper" },
      { label: "Table", caption: "Table" },
      { label: "Tabs", caption: "Tabs" },
      { label: "Toolbar", caption: "Toolbar" },
      { label: "Tooltip", caption: "Tooltip" },
      { label: "Tree", caption: "Tree" },
    ];
  }

  clickIcon(index: number, link: any) {
    this.componentService.componentName = link;
    this.componentService.component.next({
      link,
    });
    this.clickedItem = link.label;
  }
}
