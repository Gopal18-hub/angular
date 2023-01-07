export interface getCorporatemasterdetail {
    oCompanyName: getallcorporate[];
    ohsplocation: getlocationbasedcorporate[];
  }
 export interface getallcorporate {
    id: number;
    name: string;
  }

 export interface getlocationbasedcorporate{
    id?: number;
    name?: string;
  }