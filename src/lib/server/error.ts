export class NotFoundError extends Error {
  constructor(message?: string) {
    super(`Not Found (${message ?? ""})`);
  }
}

export class ConflictError extends Error {
  constructor(message?: string) {
    super(`${message || 'Conflict Error'}`);
  }
}
