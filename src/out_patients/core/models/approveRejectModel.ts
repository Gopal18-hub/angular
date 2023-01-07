export class approveRejectModel{
    ids:number[];
    userId: number;
    flag: number
    

    constructor( ids:number[],userId: number ,flag: number) 
    {
        this.ids=ids;
        this.userId=userId;
        this.flag=flag
          
      }
}