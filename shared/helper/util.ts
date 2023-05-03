import { Logger } from '@nestjs/common';
import { isNil, isString } from 'lodash';

/**
 * Json 문자열로 반환한다.
 *
 * @param value 값
 * @param space 공백
 * @param args 아규먼트
 * @link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 *
 * @example ```
 *  const obj = { a: 1, b: 2, c: 3 };
 *  const json = JSON.stringify(obj);
 *  // output: {"a":1,"b":2,"c":3}
 *  console.log(json);
 * ```
 * @returns {string}
 */
export const toStringify = (value: unknown, space?: string | number, ...args: any): string => {
  if (!isNil(value) && isString(value)) {
    return (value as string).replace(
      /%s/g,
      JSON.stringify(args, (_, v) => (typeof v === 'bigint' ? v.toString() : v), space),
    );
  }

  return JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v), space);
};

export const commanStringNumberToNumber = (str: string = "0"): number => {
  let logger = new Logger(commanStringNumberToNumber.name);
  let rst: number
  try {
    rst = Number(str.replaceAll(',', ''));
  } catch (e) {
    logger.error("❌ 콤마가 들어간 문자열인 수를 숫자로 변환하는 중 에러가 발생했습니다.", e)
  }
  return rst;
}

export function dateToIso8601(date: Date | string | null | undefined): string {
  if (date === null || date === undefined) {
    return null;
  }
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
}

export function iso8601ToDate(iso8601: string | null | undefined): Date {
  if (iso8601 === null || iso8601 === undefined) {
    return null;
  }
  return new Date(iso8601);
}

export function bigintToNumber(value: bigint): number {
  return Number(value);
}

export function numberToBigint(value: number): bigint {
  return BigInt(value);
}

export function parseNumber(
  value: string | undefined | null,
): number | undefined {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
}

export function inc<T extends string>(value: T, ...array: T[]): boolean {
  return array.includes(value);
}
