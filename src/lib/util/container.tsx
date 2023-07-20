export function uniq<T>(array: T[]): T | undefined {
  return array.length === 1 ? array[0] : undefined;
}
