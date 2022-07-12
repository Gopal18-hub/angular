export class opRegHotlistModel {
  id: number;
  maxid: string;
  ssn: string;
  patientName: string;
  age: string;
  gender: string;
  hotListing_Header: string;
  hotListing_Comment: string;
  isApproval: string;
  approvalRequestBy: string;
  approvalRequestDate: string;
  type: string;
  locationID: number;
  hotList: boolean;
  vip: boolean;
  od: boolean;
  cghs: boolean;
  mergeLinked: string;
  pPagerNumber: string;
  categoryIcons?: any[];
  firstname?: string;
  lastName?: string;
  fullname?: string;
  constructor(
    id: number,
    maxid: string,
    ssn: string,
    patientName: string,
    age: string,
    gender: string,
    hotListing_Header: string,
    hotListing_Comment: string,
    isApproval: string,
    approvalRequestBy: string,
    approvalRequestDate: string,
    type: string,
    locationID: number,
    hotList: boolean,
    vip: boolean,
    od: boolean,
    cghs: boolean,
    mergeLinked: string,
    pPagerNumber: string,
    categoryIcons?: any[],
    firstname?: string,
    lastName?: string,
    fullname?: string
  ) {
    this.id = id;
    this.maxid = maxid;
    this.ssn = ssn;
    this.patientName = patientName;
    this.age = age;
    this.gender = gender;
    this.hotListing_Header = hotListing_Header;
    this.hotListing_Comment = hotListing_Comment;
    this.isApproval = isApproval;
    this.approvalRequestBy = approvalRequestBy;
    this.approvalRequestDate = approvalRequestDate;
    this.type = type;
    this.locationID = locationID;
    this.hotList = hotList;
    this.vip = vip;
    this.od = od;
    this.cghs = cghs;
    this.mergeLinked = mergeLinked;
    this.categoryIcons = categoryIcons;
    this.firstname = firstname;
    this.lastName = lastName;
    this.fullname = firstname + " " + lastName;
    this.pPagerNumber = pPagerNumber;
  }
}
