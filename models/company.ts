export default interface Company {
  id: number;
  businessName: string;
  companyRegistrationNumber: string;
  phoneNo: string;
  faxNo: string;
  email: string;
  managedById: number | null;
}
