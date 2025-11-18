import logger from "../utils/logger.js";
import * as Sentry from "@sentry/node";
import { ValidationError } from "../errors/ValidationError.js";

const errorHandler = (err, req, res, next) => {
    const isProd = process.env.NODE_ENV === "production";
    const statusCode = err.statusCode || 500;
    const isValidation = err instanceof ValidationError;
    const isOperational = err.isOperational !== false; // по умолчанию считаем операционной

    // Логирование: 5xx — error, 4xx — warn
    const logPayload = {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode,
        message: err.message,
        stack: err.stack,
    };
    if (statusCode >= 500) {
        logger.error("Error", logPayload);
    } else {
        logger.warn("Client error", logPayload);
    }

    // Отправка в Sentry (кроме ошибок валидации)
    if (!isValidation && process.env.SENTRY_DSN) {
        Sentry.captureException(err);
    }

    let message = err.message || "Внутренняя ошибка сервера";
    if (!isOperational && isProd && !isValidation) {
        message = "Внутренняя ошибка сервера"; // скрываем детали в production
    }

    const response = { status: "error", message };
    if (isValidation && Array.isArray(err.errors)) {
        response.errors = err.errors; // массив { field, message }
    }

    res.status(isValidation ? 400 : statusCode).json(response);
};

export default errorHandler;