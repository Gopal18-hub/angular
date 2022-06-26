import { Component, OnInit, ViewChild } from '@angular/core';
import { opRegApprovalModel } from '../../../../../out_patients/core/models/opregapprovalModel.Model';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { opRegHotlistModel } from '../../../../../out_patients/core/models/opreghotlistapprovalModel.Model';
import { approveRejectModel } from '../../../../../out_patients/core/models/approveRejectModel';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { approverejectdeleteModel } from '../../../../../out_patients/core/models/approverejectdeleteModel';
import { HotListingService } from "../../../../../out_patients/core/services/hot-listing.service";
import { Router } from '@angular/router';
import { SearchService } from '../../../../../shared/services/search.service';
import { CookieService } from '../../../../../shared/services/cookie.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';
import { OpdpendingrequestModel } from '../../../../../out_patients/core/models/OpPendingRequestModel.Model';
import { ModifyDialogComponent } from '../../../../core/modify-dialog/modify-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'out-patients-op-reg-approval',
  templateUrl: './op-reg-approval.component.html',
  styleUrls: ['./op-reg-approval.component.scss']
})
export class OpRegApprovalComponent implements OnInit {
  link1 = ['OP Registration Approval', 'Hot Listing Approval']; //, 'OP Refund Approval'
  link2 = ['View Pending Request', 'Approved Requests', 'Reject Requests'];
  activeLink1 = this.link1[0];
  activeLink2 = this.link2[0];

  opApprovalList: opRegApprovalModel[] = [];
  opApprovalacceptList: opRegApprovalModel[] = [];
  opApprovalrejectList: opRegApprovalModel[] = [];

  approvePostobject: any;
  rejectPostobject: any;
  hsplocationId: any = this.cookie.get('HSPLocationId');
  userId: number = Number(this.cookie.get('UserId'));
  enableapprovebtn: boolean = false;

  showapprovalpending: boolean = false;
  showapprovalaccepting: boolean = false;
  showapprovalreject: boolean = false;
  showapprovalspinner: boolean = true;
  from: any;
  to: any;
  today = new Date();
  defaultUI: boolean = false;
  opappprovalmessage: string = "Please search From Date and To Date ";
  opapprovalimage: string = "placeholder";
  patientDetails: any = [];
  modfiedPatiendDetails: any = [];

  opapprovalpageForm = new FormGroup({
    from: new FormControl(''),
    to: new FormControl('')
  });

  @ViewChild('approvaltable') approvaltable: any;


  ApprovalidList: any = [];

  approvalconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: ['maxid', 'ssn', 'title', 'fullname', 'gender', 'uMobile', 'uEmail', 'unationality', 'uForeigner', 'usmsRecNo', 'operatorName', 'insertdatetime'],
    columnsInfo: {
      maxid: {
        title: 'Max ID',
        type: 'string'
      },
      ssn: {
        title: 'SSN',
        type: 'number'
      },
      title: {
        title: 'Title',
        type: 'string'
      },
      fullname: {
        title: 'Patient Name',
        type: 'string',
        tooltipColumn: "modifiedPtnName",
      },
      gender: {
        title: 'Gender',
        type: 'string'
      },
      uMobile: {
        title: 'Mobile',
        type: 'number'
      },
      uEmail: {
        title: 'Email',
        type: 'string',
        tooltipColumn: "uEmail",
      },
      unationality: {
        title: 'Nationality',
        type: 'string'
      },
      uForeigner: {
        title: 'Foreigner',
        type: 'checkbox'
      },
      usmsRecNo: {
        title: 'SMS Receiving Number',
        type: 'number'
      },
      operatorName: {
        title: 'Requested By',
        type: 'string'
      },
      insertdatetime: {
        title: 'Requested Date',
        type: 'date'
      }
    }
  }

  approveorrejectconfig: any = {
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: ['maxid', 'ssn', 'title', 'fullname', 'gender', 'uMobile', 'uEmail', 'unationality', 'uForeigner', 'usmsRecNo', 'operatorName', 'insertdatetime'],
    columnsInfo: {
      maxid: {
        title: 'Max ID',
        type: 'string'
      },
      ssn: {
        title: 'SSN',
        type: 'number'
      },
      title: {
        title: 'Title',
        type: 'string'
      },
      fullname: {
        title: 'Patient Name',
        type: 'string',
        tooltipColumn: "modifiedPtnName",
      },
      gender: {
        title: 'Gender',
        type: 'string'
      },
      uMobile: {
        title: 'Mobile',
        type: 'number'
      },
      uEmail: {
        title: 'Email',
        type: 'string',
        tooltipColumn: "uEmail",
      },
      unationality: {
        title: 'Nationality',
        type: 'string'
      },
      uForeigner: {
        title: 'Foreigner',
        type: 'checkbox'
      },
      usmsRecNo: {
        title: 'SMS Receiving Number',
        type: 'number'
      },
      operatorName: {
        title: 'Requested By',
        type: 'string'
      },
      insertdatetime: {
        title: 'Requested Date',
        type: 'date'
      }
    }
  }

  constructor(private http: HttpService, private router: Router, private searchService: SearchService
    , public datepipe: DatePipe, private cookie: CookieService, private messageDialogService: MessageDialogService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.searchService.searchTrigger.subscribe((formdata: any) => {
      this.searchApproval(formdata.data);
    });
   // this.showmain("OP Registration Approval");
  }

  searchApproval(formdata: any) {
    this.defaultUI = true;
    this.showapprovalspinner = true;
    this.today = new Date();
    if (formdata['from'] == "" || formdata['to'] == "") {
      this.from = formdata['from'] != "" ? formdata['from'] : this.today.setDate(this.today.getDate() - 30);
      this.from = this.datepipe.transform(this.from, 'yyyy-MM-dd');
      this.to = formdata['to'] != "" ? formdata['to'] : new Date();
      this.to = this.datepipe.transform(this.to, 'yyyy-MM-dd');
    }
    else {
      this.from = formdata['from'];
      this.from = this.datepipe.transform(this.from, 'yyyy-MM-dd');
      this.to = formdata['to'];
      this.to = this.datepipe.transform(this.to, 'yyyy-MM-dd');
    }
    this.showmain("OP Registration Approval");
  }

  showmain(link: any) {
    console.log(link);
    if (link == "OP Registration Approval") {
      this.activeLink2 != "" ? this.showgrid(this.activeLink2) : this.showgrid("View Pending Request");
    }
    else if (link == "Hot Listing Approval") {
      this.router.navigate(["registration", "hot-listing-approval"]);

    }
    else if (link == "Op Refund Approval") {

    }
  }
  showgrid(link: any) {
    this.opApprovalList = [];
    this.opApprovalacceptList = [];
    this.opApprovalrejectList = [];
    this.defaultUI = true;
    this.showapprovalspinner = true;
    console.log(link);
    if ((this.from == "" || this.from == undefined) || (this.to == "" || this.to == undefined)) {
      this.defaultUI = false;
      this.showapprovalspinner = false;
      // this.to = (this.to == "" || this.to == undefined) ?  this.today : this.to;
      // this.to = this.datepipe.transform(this.to, 'yyyy-MM-dd'); 
      // this.from = (this.from == "" || this.from == undefined) ? this.today.setDate( this.today.getDate() - 30 ) : this.from;
      // this.from = this.datepipe.transform(this.from, 'yyyy-MM-dd');         
    }

    if (link == "View Pending Request") {
      this.activeLink2 = link;
      this.getopapprovalpending().subscribe((resultData) => {
        resultData = resultData.map((item: any) => {
          item.fullname = item.firstName + ' ' + item.lastName;
          return item;
        });
        this.showapprovalspinner = false;
        this.defaultUI = true;
        this.opApprovalList = resultData as opRegApprovalModel[];
        this.showapprovalpending = true;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.enableapprovebtn = true;
        setTimeout(() => {
          this.approvaltable.selection.changed.subscribe((res: any) => {
            console.log(res);
            this.modifyDialog(res.added[0]);
          });
        });
        console.log(this.opApprovalList);
      }, (error: any) => {
        this.opApprovalList = [];
        this.enableapprovebtn = false;
        this.defaultUI = false;
        this.opappprovalmessage = "No records found";
        this.opapprovalimage = "norecordfound";
        console.log(error);
      });
    }
    else if (link == "Approved Requests") {
      this.activeLink2 = link;
      this.enableapprovebtn = false;
      this.showapprovalreject = false;
      this.showapprovalpending = false;
      this.getopapprovalaccepted().subscribe((resultData) => {
        resultData = resultData.map((item: any) => {
          item.fullname = item.firstName + ' ' + item.lastName;
          return item;
        });
        this.showapprovalspinner = false;
        this.defaultUI = true;
        this.opApprovalacceptList = resultData as opRegApprovalModel[];
        this.showapprovalaccepting = true;
        console.log(this.opApprovalacceptList);
      }, error => {
        this.opApprovalacceptList = [];
        console.log(error);
        this.defaultUI = false;
        this.opappprovalmessage = "No records found";
        this.opapprovalimage = "norecordfound";
      });
    }
    else if (link == "Reject Requests") {
      this.activeLink2 = link;
      this.enableapprovebtn = false;
      this.getopapprovalrejected().subscribe((resultData) => {
        resultData = resultData.map((item: any) => {
          item.fullname = item.firstName + ' ' + item.lastName;
          return item;
        });
        this.showapprovalspinner = false;
        this.defaultUI = true;
        this.opApprovalrejectList = resultData as opRegApprovalModel[];
        this.showapprovalreject = true;
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        console.log(this.opApprovalrejectList);

      }, error => {
        this.opApprovalrejectList = [];
        console.log(error);
        this.defaultUI = false;
        this.opappprovalmessage = "No records found";
        this.opapprovalimage = "norecordfound";
      });

    }
  }
  getopapprovalpending() {
    return this.http.get(ApiConstants.opapprovalpending(this.from, this.to, this.hsplocationId));
  }
  getopapprovalaccepted() {
    return this.http.get(ApiConstants.opapprovalaccepted(this.from, this.to, this.hsplocationId));
  }
  getopapprovalrejected() {
    return this.http.get(ApiConstants.opapprovalrejected(this.from, this.to, this.hsplocationId));
  }

  approvalApproveItem() {

    this.approvaltable.selection.selected.map((s: any) => {
      this.ApprovalidList.push(s.id)
    });
    this.approvePostobject = new approveRejectModel(this.ApprovalidList, this.userId, 0);
    this.approvalpostapi(this.approvePostobject).subscribe((resultdata) => {
      console.log(resultdata);
      this.messageDialogService.success("Update Request Approved");
      this.showgrid("View Pending Request");
      this.ApprovalidList = [];
    }, error => {
      console.log(error);
      this.ApprovalidList = [];
      this.defaultUI = true;
      this.opappprovalmessage = "No records found";
      this.opapprovalimage = "norecordfound";
    });
  }

  approvalRejectItem() {
    this.approvaltable.selection.selected.map((s: any) => {
      this.ApprovalidList.push(s.id)
    });
    this.rejectPostobject = new approveRejectModel(this.ApprovalidList, this.userId, 1);
    this.approvalpostapi(this.rejectPostobject).subscribe((resultdata) => {
      this.messageDialogService.success("Request is deleted");
      this.showgrid("View Pending Request");
      this.ApprovalidList = [];
    }, error => {
      console.log(error);
      this.ApprovalidList = [];
      this.defaultUI = true;
      this.opappprovalmessage = "No records found";
      this.opapprovalimage = "norecordfound";
    });
  }
  approvalpostapi(approvalJSONObject: approveRejectModel[]) {
    return this.http.post(ApiConstants.approvalpostapproveApi, approvalJSONObject);
  }

  modifyDialog(modfiedapprovalPatiendDetailsForPopUp: OpdpendingrequestModel) {
    this.patientDetails = [];
    this.modfiedPatiendDetails = [];
    this.patientDetails.push({
      firstname: modfiedapprovalPatiendDetailsForPopUp.firstName,
      middleName: modfiedapprovalPatiendDetailsForPopUp.middleName,
      lastName: modfiedapprovalPatiendDetailsForPopUp.lastName,
      sexName: modfiedapprovalPatiendDetailsForPopUp.gender,
      pemail: modfiedapprovalPatiendDetailsForPopUp.email,
      pphone: modfiedapprovalPatiendDetailsForPopUp.mobile,
      nationalityName: modfiedapprovalPatiendDetailsForPopUp.nationality,
      foreigner: modfiedapprovalPatiendDetailsForPopUp.foreigner,
      id: modfiedapprovalPatiendDetailsForPopUp.id
    });

    this.modfiedPatiendDetails.push({
      firstname: modfiedapprovalPatiendDetailsForPopUp.modifiedFirstName,
      middleName: modfiedapprovalPatiendDetailsForPopUp.modifiedMiddleName,
      lastName: modfiedapprovalPatiendDetailsForPopUp.modifiedLastName,
      title: modfiedapprovalPatiendDetailsForPopUp.uGender,
      pemail: modfiedapprovalPatiendDetailsForPopUp.uEmail,
      pphone: modfiedapprovalPatiendDetailsForPopUp.uMobile,
      nationality: modfiedapprovalPatiendDetailsForPopUp.unationality,
      foreigner: modfiedapprovalPatiendDetailsForPopUp.uForeigner
    });

    const modifyDetailDialogref = this.matDialog.open(ModifyDialogComponent, {
      width: "30vw",
      height: "96vh",
      data: { patientDetails: this.patientDetails[0], modifiedDetails: this.modfiedPatiendDetails[0], submitButton: true }
    });

    modifyDetailDialogref.afterClosed().subscribe((result) => {
       console.log(result.data); 
      var resultArr = result.data.split(',');
      var firstvaluekey = String(resultArr[0].split(':')[0]).trim();
      console.log(resultArr[1].trim());
      if (firstvaluekey.startsWith('Accepted')) {
        if(resultArr[1].split(':')[0].trim() == "id"){
          this.ApprovalidList.push(resultArr[1].split(':')[1]);
          this.approvePostobject = new approveRejectModel(this.ApprovalidList, this.userId, 0);
          this.approvalpostapi(this.approvePostobject).subscribe((resultdata) => {
            console.log(resultdata);
            this.messageDialogService.success("Update Request Approved");
            this.showgrid("View Pending Request");
            this.ApprovalidList = [];
          }, error => {
            console.log(error);
            this.ApprovalidList = [];
            this.defaultUI = true;
            this.opappprovalmessage = "No records found";
            this.opapprovalimage = "norecordfound";
          });
        }       
      }
      else if (firstvaluekey.startsWith('reject')) {
        if(resultArr[1].split(':')[0].trim() == "id")
        {
          this.ApprovalidList.push(resultArr[1].split(':')[1]);
          this.rejectPostobject = new approveRejectModel(this.ApprovalidList, this.userId, 1);
          this.approvalpostapi(this.rejectPostobject).subscribe((resultdata) => {
          this.messageDialogService.success("Request is Rejected");
          this.showgrid("View Pending Request");
          this.ApprovalidList = [];
          }, error => {
            console.log(error);
            this.ApprovalidList = [];
            this.defaultUI = true;
            this.opappprovalmessage = "No records found";
            this.opapprovalimage = "norecordfound";
          });
        }
      }
      // if(resultArr[1] == "id"){

      // }

    });
  }

}

