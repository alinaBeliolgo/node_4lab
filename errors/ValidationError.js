import { AppError } from "./AppError.js";

class ValidationError extends AppError {
  constructor(message = "Ошибка валидации данных", errors = []) {
    super(message, 400, true);
    this.errors = errors; // [{ field, message }]
  }
}

export { ValidationError };
export default ValidationError;