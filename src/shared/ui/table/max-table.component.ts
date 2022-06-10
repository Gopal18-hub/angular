import { Component, OnInit, Input } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'maxhealth-table',
  templateUrl: './max-table.component.html',
  styleUrls: ['./max-table.component.scss']
})
export class MaxTableComponent implements OnInit {

  @Input() config: any;

  @Input() data: any;

  selection = new SelectionModel<any>(true, []);

  dataSource: any;
  displayedColumns: string[] = [];
  displayColumnsInfo: any  = [];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayColumnsInfo = this.config.columnsInfo;
    this.displayedColumns = this.config.displayedColumns;
    if(this.config.selectBox) {
      this.displayedColumns.unshift('select');
    }
    console.log(this.displayedColumns);
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
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
