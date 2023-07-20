import dayjs, { Dayjs } from "dayjs";

export interface Address {
  roadAddress: string;
  roadAddressEnglish: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  zonecode: string;
  detail: string;
}

export function encodeAddress(address: Partial<Address>) {
  return `[[${address.zonecode ?? ""}]] [[${address.roadAddress ?? ""}::${
    address.roadAddressEnglish ?? ""
  }]] [[${address.jibunAddress ?? ""}::${
    address.jibunAddressEnglish ?? ""
  }]] [[${address.detail ?? ""}]]`;
}

export function decodeAddress(address: string | null | undefined): Address {
  try {
    if (address === null || address === undefined || address === "") {
      throw new Error();
    }

    const [zonecode, roadAddress, jibunAddress, detail] = address
      .split("]]")
      .map((p) => p.trim().replace("[[", ""));

    const [roadAddressKorean, roadAddressEnglish] = roadAddress.split("::");
    const [jibunAddressKorean, jibunAddressEnglish] = jibunAddress.split("::");

    return {
      zonecode,
      roadAddress: roadAddressKorean,
      roadAddressEnglish,
      jibunAddress: jibunAddressKorean,
      jibunAddressEnglish,
      detail,
    };
  } catch {
    return {
      zonecode: "",
      roadAddress: "",
      roadAddressEnglish: "",
      jibunAddress: "",
      jibunAddressEnglish: "",
      detail: "",
    };
  }
}

export function iso8601ToDate(
  date: string | null | undefined
): Dayjs | undefined {
  if (!date) {
    return undefined;
  }

  return dayjs(date);
}

export function dateToIso8601(date: Dayjs | null | undefined) {
  if (date === null || date === undefined) {
    return undefined;
  }

  return date.toISOString();
}
