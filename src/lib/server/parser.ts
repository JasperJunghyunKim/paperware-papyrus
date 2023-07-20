export async function parseSearchParams<T>(
  req: Request
): Promise<Record<string, string>> {
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  return searchParams;
}
