import { AppError } from "./AppError.js";

class AuthenticationError extends AppError {
  constructor(message = "Ошибка аутентификации") {
    super(message, 401, true);
  }
}

export { AuthenticationError };
export default AuthenticationError;