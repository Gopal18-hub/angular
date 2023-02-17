import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  Output,
  EventEmitter,
  NgZone,
  ViewChildren,
  QueryList,
  ElementRef,
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { map, take } from "rxjs/operators";
import * as XLSX from "xlsx";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { DatePipe } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { fromEvent } from "rxjs";

@Component({
  selector: "maxhealth-table",
  templateUrl: "./max-table.component.html",
  styleUrls: ["./max-table.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class MaxTableComponent implements OnInit, OnChanges {
  @Input() config: any;

  @Input() data: any = [];

  @Input() footerData: any = {};

  @Input() childTableRefId: any = -1;

  @Input() parentTable: any = null;

  @Output() columnClick: EventEmitter<any> = new EventEmitter();

  @Output() stringLinkOutput: EventEmitter<any> = new EventEmitter();

  @Output() rowRwmove: EventEmitter<any> = new EventEmitter();
  @Output() tableScrolling: EventEmitter<any> = new EventEmitter();
  @Output() tableSorting: EventEmitter<any> = new EventEmitter();
  @Output() controlValueChangeTrigger: EventEmitter<any> = new EventEmitter();

  @Output() actionItemClickTrigger: EventEmitter<any> = new EventEmitter();

  @Output() buttonClickTrigger: EventEmitter<any> = new EventEmitter();

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [];
  displayColumnsInfo: any = [];
  scrollHandlerscrollTop: number = 0;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild("string") stringTemplate!: TemplateRef<any>;
  @ViewChild("stringLink") stringLinkTemplate!: TemplateRef<any>;
  @ViewChild("number") numberTemplate!: TemplateRef<any>;
  @ViewChild("currency") currencyTemplate!: TemplateRef<any>;
  @ViewChild("date") dateTemplate!: TemplateRef<any>;
  @ViewChild("datetime") dateTimeTemplate!: TemplateRef<any>;
  @ViewChild("image") imageTemplate!: TemplateRef<any>;
  @ViewChild("checkbox") checkboxTemplate!: TemplateRef<any>;
  @ViewChild("checkboxActive") checkboxActiveTemplate!: TemplateRef<any>;
  @ViewChild("input") inputboxTemplate!: TemplateRef<any>;
  @ViewChild("inputPrice") inputPriceboxTemplate!: TemplateRef<any>;
  @ViewChild("textarea") textareaTemplate!: TemplateRef<any>;
  @ViewChild("inputDate") inputboxDateTemplate!: TemplateRef<any>;
  @ViewChild("inputDateTime") inputboxDateTimeTemplate!: TemplateRef<any>;
  @ViewChild("dropdown") dropdownTemplate!: TemplateRef<any>;
  @ViewChild("button") buttonTemplate!: TemplateRef<any>;
  @ViewChild("Changeablebutton") ChangeablebuttonTemplate!: TemplateRef<any>;

  initiateTable: boolean = false;

  @ViewChild("autosize") autosize!: CdkTextareaAutosize;

  tableForm!: FormGroup;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  childrensData: any = {};

  expandedElement: any | null;

  childTableConfig: any = {};

  @ViewChildren("childTable") childTable!: QueryList<any>;

  disabledCheckItems = 0;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _ngZone: NgZone,
    private datepipe: DatePipe,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tableForm = this._formBuilder.group({
      data: this._formBuilder.array([]),
    });
    if (!("rowHighlightOnHover" in this.config)) {
      this.config.rowHighlightOnHover = true;
    }
    if (this.config.groupby) {
      this.childrensData = [];
      this.data.forEach((item: any) => {
        if (item[this.config.groupby.childcolumn]) {
          if (!this.childrensData[item[this.config.groupby.childcolumn]]) {
            this.childrensData[item[this.config.groupby.childcolumn]] = [];
          }
          this.childrensData[item[this.config.groupby.childcolumn]].push(item);
        }
      });
      this.data = this.data.filter((item: any) => {
        return !item[this.config.groupby.childcolumn];
      });
    }
    let formData: any = [];
    this.data.forEach((it: any) => {
      let group: any = {};
      Object.keys(it).forEach((itk) => {
        if (
          this.config.columnsInfo[itk] &&
          ((itk + "_col_type" in it &&
            it[itk + "_col_type"] &&
            ["dropdown", "input", "input_price"].includes(
              it[itk + "_col_type"]
            )) ||
            ["dropdown", "input", "input_price"].includes(
              this.config.columnsInfo[itk].type
            ))
        ) {
          if (itk + "_required" in it && it[itk + "_required"]) {
            group[itk] = new FormControl(it[itk], Validators.required);
          } else {
            group[itk] = new FormControl(it[itk]);
          }
        }
      });
      const fg = new FormGroup(group);
      formData.push(fg);
    });
    this.tableForm.setControl("data", new FormArray(formData));
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayColumnsInfo = this.config.columnsInfo;
    this.displayedColumns = this.config.displayedColumns;
    if (this.config.clickSelection && this.config.clickSelection == "single") {
      this.selection = new SelectionModel<any>(false, []);
    }
    if (this.config.selectBox && !this.displayedColumns.includes("select")) {
      if (this.config.selectCheckBoxPosition) {
        this.displayedColumns.splice(
          this.config.selectCheckBoxPosition,
          0,
          "select"
        );
      } else {
        this.displayedColumns.unshift("select");
      }
    }
    if (
      this.config.actionItems &&
      !this.displayedColumns.includes("actionItems")
    ) {
      this.displayedColumns.push("actionItems");
    }

    if (
      this.config.removeRow &&
      !this.displayedColumns.includes("maxRemoveRow")
    ) {
      this.displayedColumns.push("maxRemoveRow");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableForm = this._formBuilder.group({
      data: this._formBuilder.array([]),
    });
    if (!("rowHighlightOnHover" in this.config)) {
      this.config.rowHighlightOnHover = true;
    }
    if (this.config.groupby) {
      this.childrensData = [];
      this.data.forEach((item: any) => {
        if (item[this.config.groupby.childcolumn]) {
          if (!this.childrensData[item[this.config.groupby.childcolumn]]) {
            this.childrensData[item[this.config.groupby.childcolumn]] = [];
          }
          this.childrensData[item[this.config.groupby.childcolumn]].push(item);
        }
      });
      this.data = this.data.filter((item: any) => {
        return !item[this.config.groupby.childcolumn];
      });
      if (Object.keys(this.childrensData).length > 0) {
        this.childTableConfig = { ...this.config };
        delete this.childTableConfig.groupby;
      }
    }

    let formData: any = [];
    this.data.forEach((it: any) => {
      let group: any = {};
      Object.keys(it).forEach((itk) => {
        if (
          this.config.columnsInfo[itk] &&
          ((itk + "_col_type" in it &&
            it[itk + "_col_type"] &&
            ["dropdown", "input", "input_price"].includes(
              it[itk + "_col_type"]
            )) ||
            ["dropdown", "input", "input_price"].includes(
              this.config.columnsInfo[itk].type
            ))
        ) {
          if (itk + "_required" in it && it[itk + "_required"]) {
            group[itk] = new FormControl(it[itk], Validators.required);
          } else {
            group[itk] = new FormControl(it[itk]);
          }
        }
      });
      const fg = new FormGroup(group);
      formData.push(fg);
    });
    this.tableForm.setControl("data", new FormArray(formData));

    this.dataSource = new MatTableDataSource<any>(this.data);

    this.displayColumnsInfo = this.config.columnsInfo;
    this.displayedColumns = this.config.displayedColumns;
    if (this.config.selectBox && !this.displayedColumns.includes("select")) {
      if (this.config.selectCheckBoxPosition) {
        this.displayedColumns.splice(
          this.config.selectCheckBoxPosition,
          0,
          "select"
        );
      } else {
        this.displayedColumns.unshift("select");
      }
    }
    if (
      this.config.actionItems &&
      !this.displayedColumns.includes("actionItems")
    ) {
      this.displayedColumns.push("actionItems");
    }

    if (
      this.config.removeRow &&
      !this.displayedColumns.includes("maxRemoveRow")
    ) {
      this.displayedColumns.push("maxRemoveRow");
    } else {
      if (
        !this.config.removeRow &&
        this.displayedColumns.includes("maxRemoveRow")
      ) {
        this.displayedColumns.splice(-1);
      }
    }
    this.tableForm.markAllAsTouched();
    setTimeout(() => {
      this.sortInitialize();
    }, 50);
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.initiateTable = true;
      this.tableForm.markAllAsTouched();
    }, -1);
  }

  sortInitialize() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (
      data: any,
      sortHeaderId: string
    ): string => {
      if (typeof data[sortHeaderId] === "string") {
        return data[sortHeaderId].toLocaleLowerCase();
      }

      return data[sortHeaderId];
    };
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
    this.tableSorting.emit(sortState);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length - this.disabledCheckItems;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    let selected = 0;
    this.disabledCheckItems = 0;
    this.dataSource.data.forEach((item: any) => {
      if ("disablecheckbox" in item && item.disablecheckbox) {
        this.disabledCheckItems++;
      } else {
        this.selection.select(item);
        selected++;
      }
    });
    //If mastercheck includes deselection,
    //the mastercheckbox has to change from indeterminate to checked status
    this.selection.selected.length = selected;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }

  getTemplate(col: any, element: any, colName: string) {
    let type = col.type;
    if (colName + "_col_type" in element && element[colName + "_col_type"]) {
      type = element[colName + "_col_type"];
    }
    if (type == "string") return this.stringTemplate;
    else if (type == "string_link") return this.stringLinkTemplate;
    else if (type == "number") return this.numberTemplate;
    else if (type == "currency") return this.currencyTemplate;
    else if (type == "date") return this.dateTemplate;
    else if (type == "datetime") return this.dateTimeTemplate;
    else if (type == "image") return this.imageTemplate;
    else if (type == "checkbox") return this.checkboxTemplate;
    else if (type == "checkbox_active") return this.checkboxActiveTemplate;
    else if (type == "input") return this.inputboxTemplate;
    else if (type == "input_price") return this.inputPriceboxTemplate;
    else if (type == "textarea") return this.textareaTemplate;
    else if (type == "input_date") return this.inputboxDateTemplate;
    else if (type == "input_datetime") return this.inputboxDateTimeTemplate;
    else if (type == "dropdown") return this.dropdownTemplate;
    else if (type == "button") return this.buttonTemplate;
    else if (type == "Changeablebutton") return this.ChangeablebuttonTemplate;
    else return this.stringTemplate;
  }

  columnClickFun(element: any, col: string) {
    this.columnClick.emit({ row: element, column: col });
    if (this.config.selectBox && this.config.clickedRows) return;
    if (this.config.selectBox && !this.config.clickedRows) return;
    if (!this.config.selectBox && !this.config.clickedRows) return;
    this.selection.toggle(element);
  }

  rowClass(row: any) {
    if (
      this.config.rowLayout &&
      this.config.rowLayout.dynamic &&
      this.config.rowLayout.dynamic.rowClass
    ) {
      return eval(this.config.rowLayout.dynamic.rowClass);
    }
  }

  exportAsExcel() {
    const excelName = this.config.tableName
      ? this.config.tableName + ".xlsx"
      : "filename.xlsx";
    const headers: any = [];
    const tempColumns: any = [];
    const data: any = [];
    this.displayedColumns.forEach((col) => {
      if (col != "select" && col != "actionItems" && col != "maxRemoveRow") {
        headers.push(this.displayColumnsInfo[col].title);
        tempColumns.push(col);
      }
    });
    this.dataSource.data.forEach((item: any) => {
      const temp: any = {};
      tempColumns.forEach((col: any) => {
        if (this.displayColumnsInfo[col].type == "dropdown") {
          if (this.displayColumnsInfo[col].options.length > 0) {
            const exist: any = this.displayColumnsInfo[col].options.find(
              (op: any) => {
                return op.value == item[col];
              }
            );
            if (exist) {
              temp[col] = exist.title;
            } else {
              temp[col] = item[col];
            }
          } else {
            temp[col] = item[col];
          }
        } else if (
          ["input_datetime", "date", "input_date", "datetime"].includes(
            this.displayColumnsInfo[col].type
          )
        ) {
          temp[col] = this.datepipe.transform(
            item[col],
            this.config.dateformat
          );
        } else {
          temp[col] = item[col];
        }
      });
      data.push(temp);
    });
    let wscols = [];
    for (var i = 0; i < headers.length; i++) {
      wscols.push({ wch: headers[i].length + 5 });
    }
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_aoa(ws, [headers]);
    const workSheet = XLSX.utils.sheet_add_json(ws, data, {
      origin: "A2",
      skipHeader: true,
      header: tempColumns,
    });
    XLSX.utils.book_append_sheet(wb, ws, "Result");
    XLSX.writeFile(wb, excelName);
  }

  removeRow(index: number, data: any) {
    this.rowRwmove.emit({ index: index, data: data });
  }

  @ViewChild("scrollabletable", { read: ElementRef })
  scrollabletable!: ElementRef;
  scrollTopHandler() {
    if (this.scrollabletable)
      this.scrollabletable.nativeElement.scrollIntoView(true);
    this.scrollHandlerscrollTop = 0;
  }

  scrollHandler(e: any) {
    e.preventDefault();
    const tableViewHeight = e.target.offsetHeight; // viewport
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    if (this.scrollHandlerscrollTop < scrollLocation) {
      // If the user has scrolled within 200px of the bottom, add more data
      const buffer = 200;
      const limit = tableScrollHeight - tableViewHeight - buffer;
      if (scrollLocation > limit) {
        this.scrollHandlerscrollTop = scrollLocation;
        this.tableScrolling.emit(e);
      }
    }
  }

  stringLinkClick(data: any) {
    this.stringLinkOutput.emit(data);
  }
  controlValueChange($event: any, data: any) {
    if ($event.type && $event.type == "change") {
      data.element[data.col] = $event.target.value;
    } else {
      data.element[data.col] = $event.value;
    }
    this.controlValueChangeTrigger.emit({ $event, data });
  }
  actionItemClick(item: any, data: any) {
    this.actionItemClickTrigger.emit({ item, data });
  }

  btnClick(item: any) {
    this.buttonClickTrigger.emit({ col: item.col, data: item.element });
  }
}
