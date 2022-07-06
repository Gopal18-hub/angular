export namespace CrystalReport {
  export const test =
    "https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?BHTN.230538";

  export const printOrganDonorForm = (maxId: string) => {
    return `https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?${maxId}`;
  };
}
