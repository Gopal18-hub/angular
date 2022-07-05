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
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { FormArray, FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "maxhealth-table-form",
  templateUrl: "./max-table-form.component.html",
  styleUrls: ["./max-table-form.component.scss"],
})
export class MaxTableFormComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() config: any;

  @Input() data: any;

  @Input() form!: FormGroup;

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
  @ViewChild("image") imageTemplate!: TemplateRef<any>;
  @ViewChild("checkbox") checkboxTemplate!: TemplateRef<any>;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayColumnsInfo = this.config.columnsInfo;
    this.displayedColumns = this.config.displayedColumns;
    if (this.config.clickSelection && this.config.clickSelection == "single") {
      this.selection = new SelectionModel<any>(false, []);
    }
    if (this.config.selectBox && !this.displayedColumns.includes("select")) {
      this.displayedColumns.unshift("select");
    }
    if (
      this.config.actionItems &&
      !this.displayedColumns.includes("actionItems")
    ) {
      this.displayedColumns.push("actionItems");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayColumnsInfo = this.config.columnsInfo;
    this.displayedColumns = this.config.displayedColumns;
    if (this.config.selectBox && !this.displayedColumns.includes("select")) {
      this.displayedColumns.unshift("select");
    }
    if (
      this.config.actionItems &&
      !this.displayedColumns.includes("actionItems")
    ) {
      this.displayedColumns.push("actionItems");
    }
    if (
      this.config.actionItems &&
      !this.displayedColumns.includes("actionItems")
    ) {
      this.displayedColumns.push("actionItems");
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

  getTemplate(type: string) {
    if (type == "string") return this.stringTemplate;
    else if (type == "number") return this.numberTemplate;
    else if (type == "date") return this.dateTemplate;
    else if (type == "image") return this.imageTemplate;
    else if (type == "checkbox") return this.checkboxTemplate;
    else return this.stringTemplate;
  }

  columnClickFun(element: any, col: string) {
    this.columnClick.emit({ row: element, column: col });
    if (this.config.selectBox && this.config.clickedRows) return;
    this.selection.toggle(element);
  }
}
