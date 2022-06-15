import { Injectable } from '@angular/core';
import { opRegHotlistModel } from '../../../out_patients/core/models/opreghotlistapprovalModel.Model';

@Injectable({
    providedIn: 'root'
  })
export class HotListingService {
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

    getAllCategoryIcons(hotlisting:opRegHotlistModel[])
    {
        
        hotlisting.forEach((e)=>{            
            e.categoryIcons = this.getCategoryIcons(e);
        });
        return hotlisting;
    }

    getCategoryIcons(hotlist:opRegHotlistModel)
    {
        let returnIcons:any= [];
        Object.keys(hotlist).forEach((e)=>{
            if(this.categoryIcons[e] && hotlist[e as keyof opRegHotlistModel]){
                returnIcons.push('assets/patient-categories/'+this.categoryIcons[e]);
            }
        });

        return returnIcons;
    }
}