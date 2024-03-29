export function formatString(pattern: string, ...values: any[]): string {
  if (values.length === 0 || values.every(value => value === undefined)) {
    return pattern;
  }
  return values.reduce(
    (currentPattern, value) => currentPattern?.replace(/%s/, value),
    pattern,
  );
}

export function dateToIso8601(
  date: Date | string | null | undefined,
): string | null {
  if (date === null || date === undefined) {
    return null;
  }
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
}

export function iso8601ToDate(iso8601: string | null | undefined): Date | null {
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

export function isValidDateRange(fromDate?: Date | null | string, toDate?: Date | null | string): boolean {
  // fromDate와 toDate가 정의되었는지 확인
  if (fromDate === null || toDate === null || fromDate === undefined || toDate === undefined || typeof 'string' === fromDate || typeof 'string' === toDate) {
    return false;
  }

  // fromDate가 toDate보다 이전이거나 같은지 확인
  if ((fromDate as Date).getTime() > (toDate as Date).getTime()) {
    return false;
  }

  return true;
}
