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
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { take } from "rxjs/operators";
import * as XLSX from "xlsx";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { DatePipe } from "@angular/common";

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
export class MaxTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() config: any;

  @Input() data: any;

  @Output() columnClick: EventEmitter<any> = new EventEmitter();

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [];
  displayColumnsInfo: any = [];

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild("string") stringTemplate!: TemplateRef<any>;
  @ViewChild("number") numberTemplate!: TemplateRef<any>;
  @ViewChild("date") dateTemplate!: TemplateRef<any>;
  @ViewChild("datetime") dateTimeTemplate!: TemplateRef<any>;
  @ViewChild("image") imageTemplate!: TemplateRef<any>;
  @ViewChild("checkbox") checkboxTemplate!: TemplateRef<any>;
  @ViewChild("checkboxActive") checkboxActiveTemplate!: TemplateRef<any>;
  @ViewChild("input") inputboxTemplate!: TemplateRef<any>;
  @ViewChild("textarea") textareaTemplate!: TemplateRef<any>;
  @ViewChild("inputDate") inputboxDateTemplate!: TemplateRef<any>;
  @ViewChild("inputDateTime") inputboxDateTimeTemplate!: TemplateRef<any>;
  @ViewChild("dropdown") dropdownTemplate!: TemplateRef<any>;

  initiateTable: boolean = false;

  @ViewChild("autosize") autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  childrensData: any = {};

  expandedElement: any | null;

  childTableConfig: any = {};

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _ngZone: NgZone,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (this.config.groupby) {
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
    this.initiateTable = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.config.groupby) {
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
      console.log(this.config);
      console.log(this.childTableConfig);
    }

    this.dataSource = new MatTableDataSource<any>(this.data);
    if (this.sort) this.dataSource.sort = this.sort;
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
    }
  }

  ngAfterViewInit() {
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
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
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

  getTemplate(col: any) {
    if (col.type == "string") return this.stringTemplate;
    else if (col.type == "number") return this.numberTemplate;
    else if (col.type == "date") return this.dateTemplate;
    else if (col.type == "datetime") return this.dateTimeTemplate;
    else if (col.type == "image") return this.imageTemplate;
    else if (col.type == "checkbox") return this.checkboxTemplate;
    else if (col.type == "checkbox_active") return this.checkboxActiveTemplate;
    else if (col.type == "input") return this.inputboxTemplate;
    else if (col.type == "textarea") return this.textareaTemplate;
    else if (col.type == "input_date") return this.inputboxDateTemplate;
    else if (col.type == "input_datetime") return this.inputboxDateTimeTemplate;
    else if (col.type == "dropdown") return this.dropdownTemplate;
    else return this.stringTemplate;
  }

  columnClickFun(element: any, col: string) {
    this.columnClick.emit({ row: element, column: col });
    if (this.config.selectBox && this.config.clickedRows) return;
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
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [headers]);
    const workSheet = XLSX.utils.sheet_add_json(ws, data, {
      origin: "A2",
      skipHeader: true,
      header: tempColumns,
    });
    XLSX.utils.book_append_sheet(wb, ws, "Result");
    XLSX.writeFile(wb, excelName);
  }

  removeRow(index: number) {
    this.dataSource = this.dataSource.splice(index, 1);
  }
}
