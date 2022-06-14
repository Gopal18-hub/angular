import { Component, OnInit } from '@angular/core';
import { opRegApprovalModel } from '../../../../../out_patients/core/models/opregapprovalModel.Model';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { opRegHotlistModel } from '../../../../../out_patients/core/models/opreghotlistapprovalModel.Model';
@Component({
  selector: 'out-patients-op-reg-approval',
  templateUrl: './op-reg-approval.component.html',
  styleUrls: ['./op-reg-approval.component.scss']
})
export class OpRegApprovalComponent implements OnInit {
  link1 = ['Op Registration Approval', 'Hot Listing Approval', 'Op Refund Approval'];
  link2 = ['View Pending Request', 'Approved Requests', 'Reject Requests'];
  activeLink1 = this.link1[0]; 
  activeLink2 = this.link2[0]; 

  opApprovalList: opRegApprovalModel[] = [];
  opApprovalacceptList: opRegApprovalModel[] = [];
  opApprovalrejectList: opRegApprovalModel[] = [];

  opApprovalHotList: opRegHotlistModel[] = [];
  opApprovalHotlistacceptList: opRegHotlistModel[] = [];
  opApprovalHotlistrejectList: opRegHotlistModel[] = [];

  showapprovalpending:boolean = false;
  showapprovalaccepting:boolean = false;
  showapprovalreject:boolean = false;

  opapproval:boolean = true;
  ophotlistingapproval:boolean = false;
  config: any  = {
    selectBox : false,
    displayedColumns: ['maxid', 'ssn', 'title', 'PatientName', 'gender', 'uMobile', 'uEmail', 'unationality', 'uForeigner', 'usmsRecNo', 'operatorName', 'insertdatetime'],
    columnsInfo: {
      maxid : {
        title: 'Max ID',
        type: 'string'
      },
      ssn : {
        title: 'SSN'
      },
      title: {
        title: 'Title'
      },
      PatientName : {
        title: 'Patient Name'
      },
      gender : {
        title: 'Gender'
      },
      uMobile : {
        title: 'Mobile'
      },
      uEmail : {
        title: 'Email'
      },
      unationality : {
        title: 'Nationality'
      },
      uForeigner : {
        title: 'Foreigner'
      },
      usmsRecNo : {
        title: 'SMS Receiving Number'
      },
      operatorName : {
        title: 'Requested By'
      },
      insertdatetime : {
        title: 'Requested Date'
      }
    }
  }
  config1: any  = {    
    selectBox : false,
    displayedColumns: ['maxid', 'ssn', 'name', 'age', 'gender', 'hotListing_Header', 'hotListing_Comment'],
    columnsInfo: {
      maxid : {
        title: 'Max ID',
      },
      ssn : {
        title: 'SSN'
      },
      name : {
        title: 'Name'
      },
      age : {
        title: 'Age'
      },
      gender : {
        title: 'Gender'
      },
      hotListing_Header : {
        title: 'Hotlisting Reason'
      },
      hotListing_Comment : {
        title: 'Remarks'
      }
    }
  }
  constructor(private http: HttpService) { }
  
  ngOnInit(): void {
    this.getopapprovalpending().subscribe((resultData) => {
      this.opApprovalList  = resultData as opRegApprovalModel[];
      this.showapprovalpending = true;
      this.showapprovalaccepting = false;
      this.showapprovalreject = false;
      console.log(this.opApprovalList);
    })
  }
  showmain(link: any)
  {
    console.log(link);
    if(link == "Op Registration Approval")
    {
      this.opapproval = true;
      this.ophotlistingapproval = false;
      this.showapprovalpending = true;
    }
    else if(link == "Hot Listing Approval")
    {
      this.opapproval = false;
      this.ophotlistingapproval = true;
      this.showapprovalpending = true;
    }
    else if(link == "Op Refund Approval")
    {

    }
  }
  showgrid(link: any)
  {
    this.opApprovalList = [];
    this.opApprovalacceptList = [];
    this.opApprovalrejectList = [];
    console.log(link);
    if(link == "View Pending Request")
    {
      if(this.opapproval == true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.ngOnInit();
      }
      else if(this.ophotlistingapproval = true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.getophotlistingpending().subscribe((resultData) => {
          this.opApprovalHotList  = resultData as opRegHotlistModel[];
          this.showapprovalpending = true;
          console.log(this.opApprovalHotList);
        })
      }
      
    }
    else if(link == "Approved Requests")
    {
      if(this.opapproval == true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.getopapprovalaccepted().subscribe((resultData) => {
        this.opApprovalacceptList  = resultData as opRegApprovalModel[];
        this.showapprovalaccepting = true;
        console.log(this.opApprovalacceptList);
      })
      }
      else if(this.ophotlistingapproval = true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.getophotlistingaccept().subscribe((resultData) => {
          this.opApprovalHotlistacceptList  = resultData as opRegHotlistModel[];
          this.showapprovalaccepting = true;
          console.log(this.opApprovalHotlistacceptList);
        })
      }
      
    }
    else if(link == "Reject Requests")
    {
      if(this.opapproval == true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.getopapprovalrejected().subscribe((resultData) => {
        this.opApprovalrejectList = resultData as opRegApprovalModel[];
        this.showapprovalreject = true;
        console.log(this.opApprovalrejectList);
      })
      }
      else if(this.ophotlistingapproval = true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.getophotlistingreject().subscribe((resultData) => {
          this.opApprovalHotlistrejectList  = resultData as opRegHotlistModel[];
          this.showapprovalreject = true;
          console.log(this.opApprovalHotlistrejectList);
        })
      }
      
    }
  }
  getopapprovalpending()
  {
    return this.http.get(environment.PatientApiUrl+'api/patient/getopregistrationpendingrequests/2022-01-01/2022-06-30/9');   
  }
  getopapprovalaccepted()
  {
    return this.http.get(environment.PatientApiUrl+'api/patient/getopregapproverejectrequests/2022-01-01/2022-06-30/9/1');   
  }
  getopapprovalrejected()
  {
    return this.http.get(environment.PatientApiUrl+'api/patient/getopregapproverejectrequests/2022-01-01/2022-06-30/9/2');
  }
  getophotlistingpending()
  {
    return this.http.get(environment.PatientApiUrl+'api/patient/getpendinghotlist/2022-01-01/2022-06-30/9');
  }
  getophotlistingaccept()
  {
    return this.http.get(environment.PatientApiUrl+'api/patient/getapprovedhotlist/2022-01-01/2022-06-30/9');
  }
  getophotlistingreject()
  {
    return this.http.get(environment.PatientApiUrl+'api/patient/getrejectedhotlist/2022-01-01/2022-06-30/9');
  }
}

