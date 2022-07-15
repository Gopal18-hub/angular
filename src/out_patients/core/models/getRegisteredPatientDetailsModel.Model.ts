export class getRegisteredPatientDetailsModel{
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    genderId: number;
    genderName: string;
    dob: boolean;
    dateOfBirth: string;
    age: number;
    agetype: number;
    ageTypeName: string;
    landlineno: any;
    mobileNo: any;
    pemail: string;
    id: number;
    ssn: string;
    nationality: string;

    constructor(
        title: string,
        firstName: string,
        middleName: string,
        lastName: string,
        genderId: number,
        genderName: string,
        dob: boolean,
        dateOfBirth: string,
        age: number,
        agetype: number,
        ageTypeName: string,
        landlineno: any,
        mobileNo: any,
        pemail: string,
        id: number,
        ssn: string,
        nationality: string
    ){
        this.title = title;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.genderId = genderId;
        this.genderName = genderName;
        this.dob = dob;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.agetype = agetype;
        this.ageTypeName = ageTypeName;
        this.landlineno = landlineno; 
        this.mobileNo = mobileNo;
        this.pemail = pemail;
        this.id = id;
        this.ssn = ssn;
        this.nationality = nationality;
    }
}