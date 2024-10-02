import { ErrorCode } from "../enum";
import { CustomError } from "./custom";

export class NotFoundError extends CustomError {
  constructor(message: string = "Resource not found") {
    super(message, ErrorCode.NotFound);
  }
}
