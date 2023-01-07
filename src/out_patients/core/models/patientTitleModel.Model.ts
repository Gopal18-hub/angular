export class PatientitleModel{
    id:number;
    name:string;
    sex:number;
    gender:string;
  
  constructor( id:number,
    name:string,sex:number,gender:string) {
    this.id=id;
    this.name=name;
    this.sex=sex;
    this.gender=gender;
      
  }
}