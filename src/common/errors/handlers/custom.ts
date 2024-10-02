import { ErrorCode } from "../enum";

export class CustomError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
