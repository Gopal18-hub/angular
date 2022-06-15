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

@Component({
  selector: 'out-patients-hot-listing-approval',
  templateUrl: './hot-listing-approval.component.html',
  styleUrls: ['./hot-listing-approval.component.scss']
})
export class HotListingApprovalComponent implements OnInit {

  link1 = ['OP Registration Approval', 'Hot Listing Approval', 'OP Refund Approval'];
  link2 = ['View Pending Request', 'Approved Requests', 'Reject Requests'];
  activeLink1 = this.link1[1];
  activeLink2 = this.link2[0];
  @ViewChild('hotlistingtable') hotlistingtable:any;
  
  HotListidList:any=[];  
  opApprovalHotList: opRegHotlistModel[] = [];
  opApprovalHotlistacceptList: opRegHotlistModel[] = [];
  opApprovalHotlistrejectList: opRegHotlistModel[] = [];

  showapprovalpending:boolean = false;
  showapprovalaccepting:boolean = false;
  showapprovalreject:boolean = false;

  fromdate:string="2022-01-01";
  todate:string="2022-06-30";
  hsplocationId:number=9;
  enablehotlistbtn:boolean=false;

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

  constructor(private http: HttpService,private hotList: HotListingService,private router: Router) { }

  ngOnInit(): void {
    this.showmain("Hot Listing Approval");
  }
  indirectlink:any;
  showmain(link: any) {
    console.log(link);
    if (link == "OP Registration Approval") {
      this.router.navigateByUrl('/registration/op-reg-approval');  
    }
    else if (link == "Hot Listing Approval") {
      this.activeLink1 = link;
      this.showgrid('View Pending Request');
    }
    else if (link == "OP Refund Approval") {

    }
  }
  showgrid(link: any) {
    console.log(link);
    if (link == "View Pending Request") {  
      this.activeLink2 = link;  
      this.getophotlistingpending().subscribe((resultData) => {
        this.opApprovalHotList  = resultData as opRegHotlistModel[];
        this.opApprovalHotList = this.hotList.getAllCategoryIcons(this.opApprovalHotList);    
        this.opApprovalHotlistacceptList = [];       
        this.enablehotlistbtn = true;
        this.showapprovalpending = true;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        console.log(this.opApprovalHotList);
      },error=>{          
        this.enablehotlistbtn = false;
        this.showapprovalaccepting = false;
        this.showapprovalreject = false;
        this.opApprovalHotList=[];
        console.log(error);
      }); 
    }
    else if (link == "Approved Requests") {
      this.activeLink2 = link; 
      this.showapprovalpending = false;
      this.showapprovalaccepting = true;
      this.showapprovalreject = false;
      this.enablehotlistbtn = false;
      this.getophotlistingaccept().subscribe((resultData) => {
        this.opApprovalHotlistacceptList  = resultData as opRegHotlistModel[];
        this.opApprovalHotlistacceptList = this.hotList.getAllCategoryIcons(this.opApprovalHotlistacceptList);
        
        console.log(this.opApprovalHotlistacceptList);
      },error=>{          
        this.enablehotlistbtn = false;
        this.showapprovalpending = false;
        this.showapprovalaccepting = true;
        this.showapprovalreject = false;
        this.opApprovalHotList=[];
        console.log(error);
      }); 
    }
    else if (link == "Reject Requests") 
    {
      this.activeLink2 = link; 
      this.showapprovalpending = false;
      this.showapprovalaccepting = false;
      this.showapprovalreject = true;
      this.enablehotlistbtn = false;
      this.getophotlistingreject().subscribe((resultData) => {
        this.opApprovalHotlistrejectList  = resultData as opRegHotlistModel[];
        this.opApprovalHotlistrejectList = this.hotList.getAllCategoryIcons(this.opApprovalHotlistrejectList);
        this.showapprovalreject = true;
        console.log(this.opApprovalHotlistrejectList);
       
      },error=>{          
        this.enablehotlistbtn = false;
        this.opApprovalHotList=[];
        console.log(error);
      }); 
    }
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

}
