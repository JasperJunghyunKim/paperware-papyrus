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

export class InternalServerError extends Error {
  constructor(message?: string) {
    super(`${message || 'Internal Server Error'}`);
  }
}
