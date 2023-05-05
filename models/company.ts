export default interface Company {
  id: number;
  businessName: string;
  companyRegistrationNumber: string;
  invoiceCode: string;
  representative: string;
  address: string;
  phoneNo: string;
  faxNo: string;
  email: string;
  managedById: number | null;
}
