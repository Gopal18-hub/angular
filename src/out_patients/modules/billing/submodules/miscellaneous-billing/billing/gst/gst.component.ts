import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-gst",
  templateUrl: "./gst.component.html",
  styleUrls: ["./gst.component.scss"],
})
export class GstComponent implements OnInit {
  @ViewChild("dillDetails") tableRows: any;
  constructor(
    private dialogRef: MatDialogRef<GstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // searchResults:{verify:string,isVerified:string,remarks:string,view:string,fileName:string,docName:string,idType:string}[]=[] as any
  ngOnInit(): void {
    console.log(this.data.searchResults);

    // this.searchResults.push({verify:"no",isVerified:"no",remarks:"no",view:"no",fileName:"xyz",docName:"docname",idType:"idtype"});
  }
  ngAfterViewInit() {
    console.log(this.data.searchResults);
    // this.getMaxID();
  }

  config: any = {
    selectBox: false,
    displayedColumns: ["service", "percentage", "value"],
    columnsInfo: {
      service: {
        title: "Services",
        type: "string",
        style: {
          width: "120px",
        },
      },
      percentage: {
        title: "Percentage",
        type: "string",
      },
      value: {
        title: "Value",
        type: "string",
      },
    },
  };
  getMaxID() {
    console.log(event);

    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
}
