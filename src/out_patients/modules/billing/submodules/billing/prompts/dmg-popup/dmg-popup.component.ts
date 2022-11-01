import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { BillingStaticConstants } from "../../BillingStaticConstant";
import { BillingService } from "../../billing.service";
@Component({
  selector: "out-patients-dmg-popup",
  templateUrl: "./dmg-popup.component.html",
  styleUrls: ["./dmg-popup.component.scss"],
})
export class DmgPopupComponent implements OnInit {
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: ["name", "shortSpec", "counter"],
    columnsInfo: {
      name: {
        title: "Name",
        type: "string",
      },
      shortSpec: {
        title: "Spec",
        type: "string",
      },
      counter: {
        title: "Counter",
        type: "number",
      },
    },
  };
  dmgFormData = {
    title: "",
    type: "object",
    properties: {
      radio: {
        type: "radio",
        required: false,
        options: [],
      },
    },
  };
  dmgform!: FormGroup;
  questions: any;
  dmgDocList: any;
  check: any = 0;
  @ViewChild("table") table: any;
  makeBillPayload: any = JSON.parse(
    JSON.stringify(BillingStaticConstants.makeBillPayload)
  );
  constructor(
    public dialogRef: MatDialogRef<DmgPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any,
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private msgdialog: MessageDialogService,
    private service: BillingService
  ) {
    console.log(inputdata);
  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dmgFormData.properties,
      {}
    );
    this.dmgform = formResult.form;
    this.questions = formResult.questions;
    this.questions[0].options = this.inputdata.dmgdata.map((l: any) => {
      return { title: l.doctorName.split(".")[1].trim(), value: l.docID };
    });
    var list = this.inputdata.dmgdata.filter((i: any) => {
      return i.id == 1;
    })
    if(list.length > 0)
    {
      this.dmgform.controls['radio'].setValue(list[0].docID);
      this.groupdoctorcheck();
    }
  }
  SelectedGroupDoc: any = [];
  ngAfterViewInit(): void{
    this.dmgform.controls['radio'].valueChanges.subscribe(() => {
      console.log(this.dmgform.controls['radio'].value);
      this.groupdoctorcheck();
    });
  }
 
  groupdoctorcheck()
  {
    this.data = [];
    this.SelectedGroupDoc = [];
    var val = this.getgroupdoctormappedwithdmg();
    console.log(val);
    console.log(this.SelectedGroupDoc);
    if(val == 1)
    {
      this.msgdialog.info('No Doctor is mapped with this DMG, Please proceed with uncheck');
    }
  }
  getgroupdoctormappedwithdmg()
  {
    this.dmgDocList = '';
    this.SelectedGroupDoc = [];
    this.http.get(BillingApiConstants.getgroupdoctormappedwithdmg(
      this.dmgform.controls['radio'].value,
      this.inputdata.specialization,
      this.cookie.get('HSPLocationId')
    ))
    .subscribe((res:any) => {
      console.log(res);
      console.log(this.SelectedGroupDoc);
      if(res.dtOncoDMGSysProposedExcluded.length == 0)
      {
        this.check = 1;
      }
      var count = 1;
      this.SelectedGroupDoc = [];
      res.dtOncoDMGSysProposedExcluded.forEach((i: any) => {
        var OSelectedGroupDoc: any = {};
        if(res.dtOncoDMGSysProposedIncluded.filter((j: any) => { return j.id == i.id}).length > 0)
        {
          OSelectedGroupDoc.chk = true;
        }
        else
        {
          OSelectedGroupDoc.chk = false;
        }
        OSelectedGroupDoc.id = i.id;
        OSelectedGroupDoc.name = i.name;
        OSelectedGroupDoc.dmgid = i.dmgid;
        OSelectedGroupDoc.seq = count;
        OSelectedGroupDoc.counter = i.counter.toString();
        OSelectedGroupDoc.specialisationId = i.specialisationId;
        OSelectedGroupDoc.shortSpec = i.shortSpec;
        OSelectedGroupDoc.active = i.active;
        this.SelectedGroupDoc.push(OSelectedGroupDoc);
        count++;
      })
      this.dmgDocList = res;
      this.data = this.SelectedGroupDoc;
      this.data.forEach((item: any) => {
        if(item.chk == 1)
          this.table.selection.select(item);
      })
    })
    console.log(this.SelectedGroupDoc);
    return this.check;
  }
  save() {
    if (this.dmgform.controls["radio"].value == "") {
      this.msgdialog.info("Please select organ (DMG)");
      return;
    } else if (this.table.selection.selected.length == 0) {
      this.msgdialog.info("Please re-select organ (DMG)");
      return;
    } else {
      this.service.dtFinalGrpDoc = {
        chk: true,
        unitDocID: this.inputdata.unitdocid.toString(),
        docID: this.dmgform.controls['radio'].value.toString()
      }
      this.table.selection.selected.forEach((item: any) => {
        this.service.dtCheckedItem.push(item);
      })
      this.service.txtOtherGroupDoc = this.inputdata.reason;
      console.log(this.service.dtFinalGrpDoc);
      this.dialogRef.close();
    }

    // this.http.get(BillingApiConstants.GetClinicDoctorsDMGRota(
    //   this.dmgform.controls['radio'].value,
    //   this.inputdata.specialization,
    //   this.cookie.get('HSPLocationId')
    // ))
    // .subscribe(res => {
    //   console.log(res);
    //   this.dialogRef.close('res:'+ res);
    // })
  }
  cancel() {
    this.dialogRef.close("Cancel");
  }
}
