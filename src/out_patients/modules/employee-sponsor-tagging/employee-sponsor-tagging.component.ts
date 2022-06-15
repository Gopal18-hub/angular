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
  
  config: any  = {
    dateformat: 'dd/MM/yyyy',
    selectBox : false,
    displayedColumns: ['maxid', 'ssn', 'date', 'firstName', 'age','gender','dob','place','phone','category'],
    columnsInfo: {
      groupCompany : {
        title: 'Group Company',
        type: 'number'
      },
      empCode : {
        title: 'EMP Code',
        type: 'number'
      },
      dob : {
        title: 'Regn.Date',
        type: 'date'
      },
      employeeName : {
        title: 'Name',
        type: 'string'
      },
      dependantName : {
        title: 'Age',
        type: 'number'
      },
      maxid : {
        title: 'Gender',
        type: 'string'
      },
      gender : {
        title: 'Date of Birth',
        type: 'date'
      },
      doj : {
        title: 'Address',
        type: 'string'
      },
      age : {
        title: 'Phone No.',
        type: 'number'
      },
      relationship : {
        title: 'Category'
      },
      remarks:{
        title:'Remarks'
      }
    }
  }  
}
