import { Modal } from "antd";
import { Record } from "./protocol";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { Protocol } from ".";
import { Model } from "@/@shared";

export type PromiseOrFn = (() => Promise<void>) | (() => any);
export async function call(p?: PromiseOrFn) {
  if (!p) {
    return;
  }

  const run = p();

  if (run instanceof Promise) {
    try {
      await run;
    } catch (err) {
      console.error(err);
    } finally {
      return;
    }
  }
}

export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function only<T>(array: T[]): T | undefined {
  return array.length === 1 ? array[0] : undefined;
}

export async function confirm(message: string) {
  return new Promise<boolean>((resolve) => {
    Modal.confirm({
      title: "확인",
      content: message,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

export function comma(
  value: string | number | null | undefined,
  precision = 0
) {
  const num = Number(value);
  return typeof num === "number" && !isNaN(num) && !isFinite(num)
    ? ""
    : num.toLocaleString("ko-KR", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
}

export function passString(value: string | null | undefined) {
  return value === null || value === undefined || value === "" ? null : value;
}

export interface Address {
  roadAddress: string;
  roadAddressEnglish: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  zonecode: string;
  detail: string;
}

export function encodeAddress(address: Partial<Address>) {
  return `[[${address.zonecode ?? ""}]] [[${address.roadAddress ?? ""}::${address.roadAddressEnglish ?? ""
    }]] [[${address.jibunAddress ?? ""}::${address.jibunAddressEnglish ?? ""
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

  return `${passString(decoded.roadAddress) ?? decoded.jibunAddress} ${decoded.detail === "" ? "" : `(${decoded.detail})`
    }`;
}

export function formatPackaging(packaging: Model.Packaging) {
  switch (packaging.type) {
    case "SKID":
      return ``;
    case "REAM":
      return `${packaging.packA}매 (/속)`;
    case "BOX":
      return `${packaging.packA}매 × ${packaging.packB}포 (/BOX)`;
    case "ROLL":
      return `${packaging.packA} ${packaging.packB === 0 ? "inch" : "cm"}`;
  }
}

export function stockUnit(packagingType: Model.Enum.PackagingType): string {
  switch (packagingType) {
    case "ROLL":
      return "t";
    case "BOX":
      return "BOX";
    case "SKID":
    case "REAM":
      return "R";
  }
}

export function priceUnit(packagingType: Model.Enum.PackagingType): PriceUnit {
  switch (packagingType) {
    case "ROLL":
      return "wpt";
    case "BOX":
      return "wpb";
    case "SKID":
    case "REAM":
      return "wpr";
  }
}

export function formatPriceUnit(packagingType: Model.Enum.PackagingType) {
  switch (packagingType) {
    case "SKID":
      return "원/R";
    case "REAM":
      return "원/R";
    case "BOX":
      return "원/BOX";
    case "ROLL":
      return "원/T";
  }
}

export const reamToSheets = (ream: number) => Math.round(ream * 500);
export const sheetsToReam = (sheets: number) => Math.round(sheets) / 500;
export type PriceUnit = "wpt" | "wpb" | "wpr";
export const toWeightPrice = (
  price: number,
  srcUnit: PriceUnit,
  dstUnit: PriceUnit,
  specs: {
    grammage: number;
    sizeX: number;
    sizeY: number;
    packaging: Model.Packaging;
  }
) => {
  const spb = specs.packaging.packA * specs.packaging.packB;

  const tpr =
    specs.grammage *
    specs.sizeX *
    (specs.sizeY ?? 0) *
    500 *
    0.000001 *
    0.001 *
    0.001;

  const tpb =
    specs.grammage *
    specs.sizeX *
    (specs.sizeY ?? 0) *
    spb *
    0.000001 *
    0.001 *
    0.001;

  const rpb = spb / 500;

  switch (srcUnit) {
    case "wpt":
      if (dstUnit == "wpr") {
        return price * tpr;
      } else if (dstUnit == "wpb") {
        return price * tpb;
      }
      break;
    case "wpb":
      if (dstUnit == "wpt") {
        return price / tpb;
      } else if (dstUnit == "wpr") {
        return price / rpb;
      }
      break;
    case "wpr":
      if (dstUnit == "wpt") {
        return price / tpr;
      } else if (dstUnit == "wpb") {
        return price / rpb;
      }
      break;
  }

  return price;
};

export function tonToGrams(ton: number) {
  return ton * 1000000;
}

export function gramsToTon(grams: number) {
  return grams / 1000000;
}

export function orderStatusToString(status: Record.OrderStatus) {
  switch (status) {
    case "PREPARING":
      return "주문 작성중";
    case "CANCELLED":
      return "주문 취소";
    case "ESTIMATE":
      return "견적 확인중";
    case "REQUESTED":
      return "주문 확인중";
    case "ACCEPTED":
      return "주문 승인";
    case "REJECTED":
      return "주문 거절";
  }
}

export function formatIso8601ToLocalDate(date: string) {
  return dayjs(date).locale("ko").format("YYYY-MM-DD (ddd)");
}

export function falsyToUndefined<T>(
  value: T | false | null | undefined
): T | undefined {
  if (value === false || value === null || value === undefined) {
    return undefined;
  }

  return value;
}

export const UNIT_GPM = "g/m²";

export function iso8601ToDate(
  date: string | null | undefined
): Dayjs | undefined {
  if (date === null || date === undefined) {
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

export function inc<T extends string>(value: T, ...array: T[]): boolean {
  return array.includes(value);
}

export function taskTypeToString(value: Model.Enum.TaskType) {
  switch (value) {
    case "CONVERTING":
      return "컨버팅";
    case "GUILLOTINE":
      return "길로틴";
    case "QUANTITY":
      return "출고 수량";
  }
}

export function taskStatusToString(value: Model.Enum.TaskStatus) {
  switch (value) {
    case "PREPARING":
      return "작업 대기중";
    case "PROGRESSING":
      return "작업 진행중";
    case "PROGRESSED":
      return "작업 완료";
  }
}

export function planStatusToString(value: Model.Enum.PlanStatus) {
  switch (value) {
    case "PREPARING":
      return "작업 대기중";
    case "PROGRESSING":
      return "작업 진행중";
    case "PROGRESSED":
      return "작업 완료";
  }
}

export function orderStatusToSTring(value: Model.Enum.OrderStatus) {
  switch (value) {
    case "ORDER_PREPARING":
      return "주문 작성중";
    case "OFFER_PREPARING":
      return "수주 작성중";
    case "ORDER_REQUESTED":
      return "주문 승인 대기중";
    case "OFFER_REQUESTED":
      return "수주 승인 대기중";
    case "ORDER_REJECTED":
      return "주문 거절";
    case "OFFER_REJECTED":
      return "수주 거절";
    case "ACCEPTED":
      return "주문 승인";
  }
}

export function formatPhoneNo(phoneNo: string | null | undefined) {
  if (phoneNo === null || phoneNo === undefined) {
    return "";
  }

  return phoneNo.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
}

export interface PaperSize {
  sizeX: number;
  sizeY: number;
  name: string;
}
export const paperSizes: PaperSize[] = [
  {
    sizeX: 636,
    sizeY: 939,
    name: "국전",
  },
  {
    sizeX: 788,
    sizeY: 1091,
    name: "4X6",
  },
  {
    sizeX: 210,
    sizeY: 297,
    name: "A4",
  },
];

export function findPaperSize(sizeX: number, sizeY: number): PaperSize | null {
  return (
    paperSizes.find(
      (paperSize) => paperSize.sizeX === sizeX && paperSize.sizeY === sizeY
    ) ?? null
  );
}

export interface ConvertQuantityOutput {
  quantity: number;
  packedQuantity: number;
  weight: number;
}

export interface ConvertQuantityInput {
  grammage: number;
  sizeX: number;
  sizeY: number;
  quantity: number;
}

export function convertQuantity(
  input: ConvertQuantityInput
): ConvertQuantityOutput {
  const { grammage, sizeX, sizeY, quantity } = input;

  const spb = grammage * sizeX * sizeY * 0.000001 * 0.001 * 0.001;

  const tpb = grammage * sizeX * sizeY * spb * 0.000001 * 0.001 * 0.001;

  const rpb = spb / 500;

  const packedQuantity = quantity / rpb;

  const weight = tpb * quantity;

  return {
    quantity,
    packedQuantity,
    weight,
  };
}
