import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'out-patients-employee-sponsor-tagging',
  templateUrl: './employee-sponsor-tagging.component.html',
  styleUrls: ['./employee-sponsor-tagging.component.scss']
})
export class EmployeeSponsorTaggingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  maxid:string='';
  
  config1: any  = {
    actionItems: true,
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
     // dependantName : {
    displayedColumns: ['groupCompany', 'empCode', 'dob', 'employeeName', 'dependantName','maxid','gender','doj','age','relationship','remarks'],
    columnsInfo: {
      groupCompany : {
        title: 'Group Company',
        type: 'string'
      },
      empCode : {
        title: 'EMP Code',
        type: 'number'
      },
      dob : {
        title: 'DOB',
        type: 'date'
      },
      employeeName : {
        title: 'Employee Name',
        type: 'string'
      },
      dependantName : {
        title: 'Dependant Name',
        type: 'string'
      },
      maxid : {
        title: 'Max Id',
        type: 'string'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      doj : {
        title: 'DOJ',
        type: 'date'
      },
      age : {
        title: 'Age',
        type: 'number'
      },
      relationship : {
        title: 'Relationship',
        type: 'string'
      },
      remarks:{
        title:'Remarks',
        type: 'string'
      }
    }
 // }  
}
  config2:any={
    actionItems: true,
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
     // dependantName : {
    displayedColumns: ['slno', 'companyname', 'dateandtime', 'addedby', 'updateddate','updatedby'],
    columnsInfo: {
      slno : {
        title: 'Sl.no',
        type: 'string'
      },
      companyname : {
        title: 'Company Name',
        type: 'number'
      },
      dateandtime : {
        title: 'Added Date & Time',
        type: 'date'
      },
      addedby : {
        title: 'Added By',
        type: 'string'
      },
      updateddate : {
        title: 'Updated Date',
        type: 'string'
      },
      updatedby : {
        title: 'Updated By',
        type: 'string'
      },
     
    }
  }

}
