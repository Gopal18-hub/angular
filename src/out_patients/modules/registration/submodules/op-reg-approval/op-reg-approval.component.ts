import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'out-patients-op-reg-approval',
  templateUrl: './op-reg-approval.component.html',
  styleUrls: ['./op-reg-approval.component.scss']
})
export class OpRegApprovalComponent implements OnInit {
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0]; 
  isAPIProcess:boolean=false;
  data: any[] = [
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'},
    {MaxId: 'BHTN.148464', SSN:'08148464', title:'mr', PatientName: 'name name', Gender:'Male', Mobile:'9898989898', Email:'info@mail.com', Nationality:'Indian', Foreigner:'1', SMSnumber:'988889898',RequestedBy:'ABC', requesteddate:'22-9-2021'}
  ];

  config: any  = {
    selectBox : true,
    displayedColumns: ['MaxId', 'SSN', 'title', 'PatientName', 'Gender', 'Mobile', 'Email', 'Nationality', 'Foreigner', 'SMSnumber', 'RequestedBy', 'requesteddate'],
    columnsInfo: {
      MaxId : {
        title: 'Max ID'
      },
      SSN : {
        title: 'SSN'
      },
      title: {
        title: 'Title'
      },
      PatientName : {
        title: 'Patient Name'
      },
      Gender : {
        title: 'Gender'
      },
      Mobile : {
        title: 'Mobile'
      },
      Email : {
        title: 'Email'
      },
      Nationality : {
        title: 'Nationality'
      },
      Foreigner : {
        title: 'Foreigner'
      },
      SMSnumber : {
        title: 'SMS Receiving Number'
      },
      RequestedBy : {
        title: 'Requested By'
      },
      requesteddate : {
        title: 'Requested Date'
      }
    }
  }
  constructor() { }
  
  ngOnInit(): void {
  }
}
