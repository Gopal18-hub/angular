import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-unbilled-investigation",
  templateUrl: "./unbilled-investigation.component.html",
  styleUrls: ["./unbilled-investigation.component.scss"],
})
export class UnbilledInvestigationComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  testNameAlertExist:boolean=true;
  duplicateItemArray:any=[];
  testNameErrorRef:any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "testName",
      "docName",
      "visitDateTime",
      "labItemPriority",
      "specialization",
    ],
    columnsInfo: {
      testName: {
        title: "Test Name",
        type: "number",
      },
      docName: {
        title: "Doctor Name",
        type: "string",
      },
      visitDateTime: {
        title: "Visit Date Time",
        type: "date",
      },
      labItemPriority: {
        title: "Priority",
        type: "string",
      },
      specialization: {
        title: "Specialisation",
        type: "string",
      },
    },
  };

  disableProcess: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UnbilledInvestigationComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.data = this.inputdata.investigations;
  }

  ngAfterViewInit() {
    this.tableRows.selection.changed.subscribe((res: any) => {
     this.checkDuplicate();  
    });
  }

  checkDuplicate() {
    let temp: any = [];
    let existProcess = false;
    let selectedTestName:any
    for (let i = 0; i < this.tableRows.selection.selected.length; i++) {
      if (temp.includes(this.tableRows.selection.selected[i].testID)) {
        this.disableProcess = true;
        existProcess = true;
        selectedTestName=this.tableRows.selection.selected[i].testName
       this.duplicateItemArray.push(selectedTestName)
        //break;
      }
      else{
           this.duplicateItemArray.splice(i, 1);
      }
     
      temp.push(this.tableRows.selection.selected[i].testID);
     
    }
      if(this.testNameErrorRef){
        this.testNameErrorRef.close()
      }
    if(this.duplicateItemArray.length>0){
      this.duplicateItemArray = this.duplicateItemArray.filter((item:any, value:any)=>{
        return this.duplicateItemArray.indexOf(item)== value; 
      });
      this.testNameAlertExist=false
      if(existProcess){
     this.testNameErrorRef=  this.messageDialogService.error(
        "Already selected the test - <b>" +
        this.duplicateItemArray.toString() +
          "</b>"
      );
     }
       this.testNameErrorRef.afterClosed().subscribe(async (result: any) => {
       this.duplicateItemArray=[]
       });
     
    }
    if (!existProcess) this.disableProcess = false;
  }

  process() {
    this.dialogRef.close({
      process: 1,
      data: this.tableRows.selection.selected,
    });
  }

  cancel() {
    this.dialogRef.close({ process: 0 });
  }
}
