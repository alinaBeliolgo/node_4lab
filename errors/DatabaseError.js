import { AppError } from "./AppError.js";

class DatabaseError extends AppError {
  constructor(message = "Ошибка базы данных") {
    super(message, 500, true);
  }
}

export { DatabaseError };
export default DatabaseError;
