import { ErrorCode } from "../enum";
import { CustomError } from "./custom";

export class FailureError extends CustomError {
  constructor(message: string = "Failure") {
    super(message, ErrorCode.Failure);
  }
}
