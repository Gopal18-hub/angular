export class patientImageModel {
  registrationno: number;
  iacode: string;
  image: string;
  constructor(
    registrationno: number,
    iacode: string,
    image: string
  ) {
    this.registrationno = registrationno;
    this.iacode = iacode;
    this.image = image;
  }
}