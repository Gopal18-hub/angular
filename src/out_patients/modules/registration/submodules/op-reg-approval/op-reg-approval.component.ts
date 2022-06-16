import { Component, OnInit,ViewChild } from '@angular/core';
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
import { DatePipe } from '@angular/common'

@Component({
  selector: 'out-patients-op-reg-approval',
  templateUrl: './op-reg-approval.component.html',
  styleUrls: ['./op-reg-approval.component.scss']
})
export class OpRegApprovalComponent implements OnInit {
  link1 = ['OP Registration Approval', 'Hot Listing Approval', 'OP Refund Approval'];
  link2 = ['View Pending Request', 'Approved Requests', 'Reject Requests'];
  activeLink1 = this.link1[0]; 
  activeLink2 = this.link2[0]; 

  opApprovalList: opRegApprovalModel[] = [];
  opApprovalacceptList: opRegApprovalModel[] = [];
  opApprovalrejectList: opRegApprovalModel[] = [];

  approvePostobject:any;
  rejectPostobject:any;
  hsplocationId:number=9;
  enableapprovebtn:boolean=false;
 
  showapprovalpending:boolean = false;
  showapprovalaccepting:boolean = false;
  showapprovalreject:boolean = false;
  from :any;
  to :any;

  opapprovalpageForm = new FormGroup({
    from: new FormControl(''),
    to: new FormControl('')
  });
  
  @ViewChild('approvaltable') approvaltable:any;
 

  ApprovalidList:any=[];

  approvalconfig: any  = {   
    dateformat: "dd/MM/yyyy",
    selectBox : true,
    displayedColumns: ['maxid', 'ssn', 'title', 'firstName', 'gender', 'uMobile', 'uEmail', 'unationality', 'uForeigner', 'usmsRecNo', 'operatorName', 'insertdatetime'],
     columnsInfo: {
      maxid : {
        title: 'Max ID',
        type: 'string'
      },
      ssn : {
        title: 'SSN',
        type: 'number'
      },
      title: {
        title: 'Title',
        type: 'string'
      },
      firstName : {
        title: 'Patient Name',
        type: 'string',
        tooltipColumn: "modifiedPtnName",
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      uMobile : {
        title: 'Mobile',
        type: 'number'
      },
      uEmail : {
        title: 'Email',
        type: 'string'
      },
      unationality : {
        title: 'Nationality',
        type: 'string'
      },
      uForeigner : {
        title: 'Foreigner',
        type: 'checkbox'
      },
      usmsRecNo : {
        title: 'SMS Receiving Number',
        type: 'number'
      },
      operatorName : {
        title: 'Requested By',
        type: 'string'
      },
      insertdatetime : {
        title: 'Requested Date',
        type: 'date'
      }
    }
  }

  approveorrejectconfig: any  = {  
    dateformat: "dd/MM/yyyy",
    selectBox : false,
    displayedColumns: ['maxid', 'ssn', 'title', 'firstName', 'gender', 'uMobile', 'uEmail', 'unationality', 'uForeigner', 'usmsRecNo', 'operatorName', 'insertdatetime'],
     columnsInfo: {
      maxid : {
        title: 'Max ID',
        type: 'string'
      },
      ssn : {
        title: 'SSN',
        type: 'number'
      },
      title: {
        title: 'Title',
        type: 'string'
      },
      firstName : {
        title: 'Patient Name',
        type: 'string',
        tooltipColumn: "modifiedPtnName",
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      uMobile : {
        title: 'Mobile',
        type: 'number'
      },
      uEmail : {
        title: 'Email',
        type: 'string'
      },
      unationality : {
        title: 'Nationality',
        type: 'string'
      },
      uForeigner : {
        title: 'Foreigner',
        type: 'checkbox'
      },
      usmsRecNo : {
        title: 'SMS Receiving Number',
        type: 'number'
      },
      operatorName : {
        title: 'Requested By',
        type: 'string'
      },
      insertdatetime : {
        title: 'Requested Date',
        type: 'date'
      }
    }
  }

  constructor(private http: HttpService,private router: Router,private searchService: SearchService
    ,public datepipe: DatePipe, private cookie: CookieService) { }
  
  ngOnInit(): void {
    this.searchService.searchTrigger.subscribe((formdata: any) => {
      this.searchApproval(formdata.data);
    });
   
  }

  searchApproval(formdata:any) {
    if(formdata['from'] == '' && formdata['to'] == '' )
      return;
      this.from = formdata['from'];
      this.from = this.datepipe.transform(this.from, 'yyyy-MM-dd');      
      this.to = formdata['to'];
      this.to = this.datepipe.transform(this.to, 'yyyy-MM-dd'); 
      this.showmain("OP Registration Approval");
  
  }

  showmain(link: any)
  {
    console.log(link);
    if(link == "OP Registration Approval")
    {
      this.showgrid('View Pending Request');
    }
    else if(link == "Hot Listing Approval")
    { 
      this.router.navigateByUrl('/registration/hot-listing-approval');   
      
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
      this.activeLink2 = link;     
        this.getopapprovalpending().subscribe((resultData) => {
          this.opApprovalList  = resultData as opRegApprovalModel[];
          this.showapprovalpending = true;        
          this.showapprovalaccepting = false;
          this.showapprovalreject = false;
          this.enableapprovebtn = true;
          console.log(this.opApprovalList);
        },error=>{
          this.opApprovalList =[];
          this.enableapprovebtn = false;  
          console.log(error);
        });           
    }
    else if(link == "Approved Requests")
    {    
      this.activeLink2 = link;
        this.enableapprovebtn = false;
        this.showapprovalreject = false;
        this.showapprovalpending = false;
        this.getopapprovalaccepted().subscribe((resultData) => {
        this.opApprovalacceptList  = resultData as opRegApprovalModel[];
        this.showapprovalaccepting = true;
        console.log(this.opApprovalacceptList);       
      },error=>{   
        this.opApprovalacceptList=[];       
        console.log(error);
      }); 
    }
    else if(link == "Reject Requests")
    {   
      this.activeLink2 = link;   
        this.enableapprovebtn = false;
        this.getopapprovalrejected().subscribe((resultData) => {
        this.opApprovalrejectList = resultData as opRegApprovalModel[];
        this.showapprovalreject = true;
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        console.log(this.opApprovalrejectList);
      
      },error=>{     
        this.opApprovalrejectList=[];     
        console.log(error);
      });       
           
    }
  }
  getopapprovalpending()
  {
    return this.http.get(ApiConstants.opapprovalpending(this.from,this.to,this.hsplocationId));   
  }
  getopapprovalaccepted()
  {
    return this.http.get(ApiConstants.opapprovalaccepted(this.from,this.to,this.hsplocationId));   
  }
  getopapprovalrejected()
  {
    return this.http.get(ApiConstants.opapprovalrejected(this.from,this.to,this.hsplocationId));
  }
  
  approvalApproveItem(){
    this.approvaltable.selection.selected.map((s:any)=>{
    this.ApprovalidList.push({id:s.id})});
    let userId = 1;//Number(this.cookie.get('UserId'));
    this.approvePostobject = new approveRejectModel(this.ApprovalidList,userId,0);
    this.approvalpostapi(this.approvePostobject).subscribe((resultdata)=>{
      console.log(resultdata);
      for(let id of this.ApprovalidList)
      {        
         const index: number = this.opApprovalList.findIndex(i => i.id == id.id);
         if(index !== -1)
         {          
          this.opApprovalList = this.opApprovalList.splice(index,1);
         }
      }
      this.ApprovalidList = [];
    },error=>{
      console.log(error);
    }); 
  }

  approvalRejectItem(){
    this.approvaltable.selection.selected.map((s:any)=>{
      this.ApprovalidList.push({id:s.id})});
      let userId = 1;//Number(this.cookie.get('UserId'));
      this.rejectPostobject = new approveRejectModel(this.ApprovalidList,userId,1);
  
      this.approvalpostapi(this.rejectPostobject).subscribe((resultdata)=>{
        console.log(resultdata);
        for(let id of this.ApprovalidList)
        {        
           const index: number = this.opApprovalList.findIndex(i => i.id == id.id);
           if(index !== -1)
           {
            this.opApprovalList = this.opApprovalList.splice(index,1);
           }
        }
        this.ApprovalidList = [];
      },error=>{
        console.log(error);
      }); 
  }
  approvalpostapi(approvalJSONObject:approveRejectModel[]){   
    return this.http.post(ApiConstants.approvalpostapproveApi,approvalJSONObject);
  }
}

