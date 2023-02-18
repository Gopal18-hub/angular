export class SimilarSoundPatientResponse {
  maxid: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  age: string;
  ageType: string;
  gender: string;
  dob: string;
  constructor(
    maxid: string,
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    age: string,
    ageType: string,
    gender: string,
    dob: string
  ) {
    this.maxid = maxid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.address = address;
    this.age = age;
    this.ageType = ageType;
    this.gender = gender;
    this.dob = dob;
  }
}
