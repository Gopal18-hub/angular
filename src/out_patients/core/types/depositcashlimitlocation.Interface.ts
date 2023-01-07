export interface PatientDepositCashLimitLocationDetail{
    cashLimitOfLocation: cashLimitOfLocation[];
    locationSMSDetails: locationSMSDetails[];   
    }
    
    export interface locationSMSDetails{   
       locationid: number,
       activeModule: string,
       opManagerPhoneNo: string,
       emManagerPhoneNo: string,
       ipManagerPhoneNo: string,
       preAdtManagerPhoneNo: string,
       smsToBoth: number
    }
  
    export interface cashLimitOfLocation{    
        cashLimit: number      
    }