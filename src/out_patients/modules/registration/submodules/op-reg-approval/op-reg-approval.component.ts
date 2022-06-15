import { Component, OnInit,ViewChild } from '@angular/core';
import { opRegApprovalModel } from '../../../../../out_patients/core/models/opregapprovalModel.Model';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { opRegHotlistModel } from '../../../../../out_patients/core/models/opreghotlistapprovalModel.Model';
import { approveRejectModel } from '../../../../../out_patients/core/models/approveRejectModel';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { approverejectdeleteModel } from '../../../../../out_patients/core/models/approverejectdeleteModel';
import { HotListingService } from "../../../../../out_patients/core/services/hot-listing.service";

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

  opApprovalHotList: opRegHotlistModel[] = [];
  opApprovalHotlistacceptList: opRegHotlistModel[] = [];
  opApprovalHotlistrejectList: opRegHotlistModel[] = [];
  approvePostobject:any;
  rejectPostobject:any;
  fromdate:string="2022-01-01";
  todate:string="2022-06-30";
  hsplocationId:number=9;
  enableapprovebtn:boolean=false;
  enablehotlistbtn:boolean=false;

  showapprovalpending:boolean = false;
  showapprovalaccepting:boolean = false;
  showapprovalreject:boolean = false;
  isbuttonenable:boolean=false;
  opapproval:boolean = true;
  ophotlistingapproval:boolean = false;
  @ViewChild('approvaltable') approvaltable:any;
  @ViewChild('hotlistingtable') hotlistingtable:any;

  ApprovalidList:any=[];
  HotListidList:any=[];

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
        type: 'string'
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
        type: 'string'
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

  hotlistingconfig: any  = {
    actionItems: true,
    dateformat: "dd/MM/yyyy",
    selectBox : true,
    displayedColumns: ['maxid', 'ssn', 'patientName', 'age', 'gender', 'hotListing_Header', 'hotListing_Comment', 'categoryIcons'],
    columnsInfo: {
      maxid : {
        title: 'Max ID',
        type: 'string'
      },
      ssn : {
        title: 'SSN',
        type: 'number'
      },
      patientName : {
        title: 'Name',
        type: 'string'
      },
      age : {
        title: 'Age',
        type: 'number'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      hotListing_Header : {
        title: 'Hotlisting Reason',
        type: 'string'
      },
      hotListing_Comment : {
        title:'Remarks',
        type: 'string'
      },
      categoryIcons : {
        title: 'Category',
        type: "image",
        width: 34,
      }
    }
  }

  hotlistingapproveorrejectconfig: any  = {
    actionItems: true,
    dateformat: "dd/MM/yyyy",
    selectBox : false,
    displayedColumns: ['maxid', 'ssn', 'patientName', 'age', 'gender', 'hotListing_Header', 'hotListing_Comment', 'categoryIcons'],
    columnsInfo: {
      maxid : {
        title: 'Max ID',
        type: 'string'
      },
      ssn : {
        title: 'SSN',
        type: 'number'
      },
      patientName : {
        title: 'Name',
        type: 'string'
      },
      age : {
        title: 'Age',
        type: 'number'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      hotListing_Header : {
        title: 'Hotlisting Reason',
        type: 'string'
      },
      hotListing_Comment : {
        title:'Remarks',
        type: 'string'
      },
      categoryIcons : {
        title: 'Category',
        type: "image",
        width: 34,
      }
    }
  }
  constructor(private http: HttpService,private hotList: HotListingService) { }
  
  ngOnInit(): void {
    this.getopapprovalpending().subscribe((resultData) => {
      this.opApprovalList  = resultData as opRegApprovalModel[];
      this.showapprovalpending = true;
      this.showapprovalaccepting = false;
      this.showapprovalreject = false;
      this.enableapprovebtn = true;
      this.enablehotlistbtn = true;
      console.log(this.opApprovalList);
    },error=>{
      this.opApprovalList =[];
      console.log(error);
    }); 
  }
  showmain(link: any)
  {
    console.log(link);
    if(link == "Op Registration Approval")
    {
      this.opapproval = true;
      this.ophotlistingapproval = false;
      this.showapprovalpending = true;
      this.showgrid('View Pending Request');
    }
    else if(link == "Hot Listing Approval")
    {
      this.opapproval = false;
      this.ophotlistingapproval = true;
      this.showapprovalpending = true;
      this.showgrid('View Pending Request');
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
        this.enableapprovebtn = true;
      }
      else if(this.ophotlistingapproval = true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.getophotlistingpending().subscribe((resultData) => {
          this.opApprovalHotList  = resultData as opRegHotlistModel[];
          this.opApprovalHotList = this.hotList.getAllCategoryIcons(this.opApprovalHotList);
          this.showapprovalpending = true;
          this.opApprovalHotlistacceptList = [];
         
          this.enablehotlistbtn = true;
          console.log(this.opApprovalHotList);
        },error=>{          
          this.enablehotlistbtn = false;
          this.opApprovalHotList=[];
          console.log(error);
        }); 
      }
      
    }
    else if(link == "Approved Requests")
    {
      if(this.opapproval == true)
      {
        this.showapprovalpending = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.enableapprovebtn = false;
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
        this.enablehotlistbtn = false;
        this.getophotlistingaccept().subscribe((resultData) => {
          this.opApprovalHotlistacceptList  = resultData as opRegHotlistModel[];
          this.opApprovalHotlistacceptList = this.hotList.getAllCategoryIcons(this.opApprovalHotlistacceptList);
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
        this.enableapprovebtn = false;
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
        this.enablehotlistbtn = false;
        this.getophotlistingreject().subscribe((resultData) => {
          this.opApprovalHotlistrejectList  = resultData as opRegHotlistModel[];
          this.opApprovalHotlistrejectList = this.hotList.getAllCategoryIcons(this.opApprovalHotlistrejectList);
          this.showapprovalreject = true;
          console.log(this.opApprovalHotlistrejectList);
         
        })
      }
      
    }
  }
  getopapprovalpending()
  {
    return this.http.get(ApiConstants.opapprovalpending(this.fromdate,this.todate,this.hsplocationId));   
  }
  getopapprovalaccepted()
  {
    return this.http.get(ApiConstants.opapprovalaccepted(this.fromdate,this.todate,this.hsplocationId));   
  }
  getopapprovalrejected()
  {
    return this.http.get(ApiConstants.opapprovalrejected(this.fromdate,this.todate,this.hsplocationId));
  }
  getophotlistingpending()
  {
    return this.http.get(ApiConstants.ophotlistingpending(this.fromdate,this.todate,this.hsplocationId));
  }
  getophotlistingaccept()
  {
    return this.http.get(ApiConstants.ophotlistingaccept(this.fromdate,this.todate,this.hsplocationId));
  }
  getophotlistingreject()
  {
    return this.http.get(ApiConstants.ophotlistingreject(this.fromdate,this.todate,this.hsplocationId));
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

  hotlistApproveItem(){
    this.hotlistingtable.selection.selected.map((s:any)=>{
      this.HotListidList.push({id:s.id})});
      let userId = 1;//Number(this.cookie.get('UserId'));
      this.hotlistingpostapi(this.HotListidList,userId,1).subscribe((resultdata)=>{
        console.log(resultdata);
        for(let id of this.HotListidList)
        {        
           const index: number = this.opApprovalHotList.findIndex(i => i.id == id.id);
           if(index !== -1)
           {
            this.opApprovalHotList = this.opApprovalHotList.splice(index,1);
           }
        }
        this.HotListidList = [];
      },error=>{
        console.log(error);
        this.HotListidList = [];
      }); 
  }

  hotlistRejectItem(){
    this.hotlistingtable.selection.selected.map((s:any)=>{
      this.HotListidList.push({id:s.id})});
      let userId = 1;//Number(this.cookie.get('UserId'));
      this.hotlistingpostapi(this.HotListidList,userId,2).subscribe((resultdata)=>{
        console.log(resultdata);
        for(let id of this.HotListidList)
        {        
           const index: number = this.opApprovalHotList.findIndex(i => i.id == id.id);
           if(index !== -1)
           {
            this.opApprovalHotList = this.opApprovalHotList.splice(index,1);
           }
        }
        this.HotListidList = [];
      },error=>{
        console.log(error);
        this.HotListidList = [];
      }); 
  }

  hotlistDeleteItem(){
    this.hotlistingtable.selection.selected.map((s:any)=>{
      this.HotListidList.push({id:s.id})});
      let userId = 1;//Number(this.cookie.get('UserId'));
      this.hotlistingpostapi(this.HotListidList,userId,3).subscribe((resultdata)=>{
        console.log(resultdata);
        for(let id of this.HotListidList)
        {        
           const index: number = this.opApprovalHotList.findIndex(i => i.id == id.id);
           if(index !== -1)
           {
            this.opApprovalHotList = this.opApprovalHotList.splice(index,1);
           }
        }
        this.HotListidList = [];
      },error=>{
        console.log(error);
        this.HotListidList = [];
      }); 
  }

  hotlistingpostapi(hotlistingJSONObject:approverejectdeleteModel[],userid:number,flag:number){   
    return this.http.post(ApiConstants.hotlistingpostapproveApi(userid,flag),hotlistingJSONObject);
  }
}

