import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReportService } from "@shared/services/report.service";
@Component({
  selector: "out-patients-popuptext",
  templateUrl: "./popuptext.component.html",
  styleUrls: ["./popuptext.component.scss"],
})
export class PopuptextComponent implements OnInit {
  popuptext: any = [];

  constructor(
    public dialogRef: MatDialogRef<PopuptextComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportService: ReportService
  ) {}
  item: any[] = [];
  description: any[] =[];
  ngOnInit(): void {
    this.popuptext = this.data.popuptext;
    this.popuptext.forEach((i: any) => {
      this.item.push(i.name);
      this.description.push(i.description);
    })
  }

  printbtn()
  {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(()=>{
      this.reportService.openWindow('InvestigationInstruction', 'InvestigationInstruction', {
        ItemName: btoa(JSON.stringify(this.item)),
        description: btoa(JSON.stringify(this.description))
      });
    })
    
  }

}
