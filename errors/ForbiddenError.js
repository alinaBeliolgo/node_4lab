import { AppError } from "./AppError.js";

class ForbiddenError extends AppError {
  constructor(message = "Недостаточно прав") {
    super(message, 403, true);
  }
}

export { ForbiddenError };
export default ForbiddenError;
