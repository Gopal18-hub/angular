import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'out-patients-acd',
  templateUrl: './acd.component.html',
  styleUrls: ['./acd.component.scss']
})
export class AcdComponent implements OnInit {
  
  link1 = ["Investigation Orders", "Medical Orders"]; 
  activeLink1 = this.link1[0];

  orgList=["id","1","name","Max HealthCare"]
  
 
    config3: any  = {
      actionItems: false,
      dateformat: 'dd/MM/yyyy',
      selectBox : true,
      displayedColumns: ['drugname', 'schedule','drugqty','days','dosagename','visitdate','acdremarks'],
      columnsInfo: {
        drugname : {
          title: 'Drug Name',
          type: 'string'
        },
        schedule : {
          title: 'Schedule',
          type: 'string'
        },
        drugqty : {
          title: 'Drug Qty',
          type: 'string'
        },
        days : {
          title: 'Days',
          type: 'string'
        },
        dosagename : {
          title: 'Dosage Name',
          type: 'string'
        },
        visitdate : {
          title: 'Visit Date',
          type: 'string'
        },
        acdremarks : {
          title: 'ACD Remarks',
          type: 'string'
        },
       
      }
   
      }
   
    data2:any[]=[
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }    
    ] 





    //New
    links = [
      {
        title: "Investigation Orders",
        path: "investigation-orders",
      },
      {
        title: "Medical Orders",
        path: "medicine-orders",
      }     
    ]; 
    activeLink = this.links[0];
    //New
  constructor() { }

  ngOnInit(): void {
    
   

    
  }
  
  

}
