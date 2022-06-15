import { Injectable } from '@angular/core';
import { getmergepatientsearch } from '../models/getmergepatientsearch';
import { PatientSearchModel } from '../models/patientSearchModel';

@Injectable({
    providedIn: 'root'
  })
export class PatientService {
    categoryIcons:any={
        'cghs': 'CGHS_Icon.svg',
        'hotList':'Hot_listing_icon.svg',
        'mergeLinked':'merge.svg',
        'vip':'vip_icon.svg',
        'note':'Notes_icon.svg',
        'cash':'Cash_Icon.svg',
        'psu':'PSU_icon.svg',
        'ews':'EWS.svg',
        'ins':'Ins_icon.svg',
        'hwc':'HWC_icon.svg'        
    }

    constructor() { }

    getAllCategoryIcons(patientSearchModel:PatientSearchModel[] | getmergepatientsearch[], model: any = PatientSearchModel)
    {
        
        patientSearchModel.forEach((e)=>{            
            e.categoryIcons = this.getCategoryIcons(e);
        });
        return patientSearchModel as typeof model;
    }

    getCategoryIcons(patient:PatientSearchModel | getmergepatientsearch)
    {
        let returnIcons:any= [];
        Object.keys(patient).forEach((e)=>{
            if(this.categoryIcons[e] && patient[e as keyof (PatientSearchModel |getmergepatientsearch)]){
                returnIcons.push('assets/patient-categories/'+this.categoryIcons[e]);
            }
        });

        return returnIcons;
    }
}