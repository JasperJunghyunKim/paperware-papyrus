import { Address, decodeAddress } from "./parser";

export function passString(value: string | null | undefined) {
  return value === null || value === undefined || value === "" ? null : value;
}

export function formatAddress(address: string | Address | null | undefined) {
  if (address === null || address === undefined || address === "") {
    return "";
  }

  const decoded =
    typeof address === "string" ? decodeAddress(address) : address;

  if (
    decoded.roadAddress === "" &&
    decoded.jibunAddress === "" &&
    decoded.detail === ""
  ) {
    return "";
  }

  return `${passString(decoded.roadAddress) ?? decoded.jibunAddress} ${
    decoded.detail === "" ? "" : `(${decoded.detail})`
  }`;
}

export function formatPhoneNo(phoneNo: string | null | undefined) {
  if (phoneNo === null || phoneNo === undefined) {
    return "";
  }

  return phoneNo.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
}

export function formatCompanyRegistrationNo(
  companyRegistrationNo: string | null | undefined
) {
  if (companyRegistrationNo === null || companyRegistrationNo === undefined) {
    return "";
  }

  return companyRegistrationNo.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
}

export function formatCorporateRegistrationNo(
  corporateRegistrationNo: string | null | undefined
) {
  if (
    corporateRegistrationNo === null ||
    corporateRegistrationNo === undefined
  ) {
    return "";
  }

  return corporateRegistrationNo.replace(/(\d{6})(\d{7})/, "$1-$2");
}
