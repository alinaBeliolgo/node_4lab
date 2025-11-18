import { body, validationResult } from "express-validator";
import { ValidationError } from "../errors/ValidationError.js";

// Валидация регистрации
export const registerValidator = [
	body("username")
		.trim()
		.isLength({ min: 3, max: 50 })
		.withMessage("username должен быть от 3 до 50 символов"),
	body("email")
		.trim()
		.isEmail()
		.withMessage("Некорректный email")
		.isLength({ max: 100 })
		.withMessage("email слишком длинный"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Пароль минимум 6 символов"),
	body("role")
		.optional()
		.isIn(["user", "admin"])
		.withMessage("role должен быть 'user' или 'admin'"),
];

// Валидация логина
export const loginValidator = [
	body("login")
		.trim()
		.notEmpty()
		.withMessage("Поле login обязательно"),
	body("password")
		.notEmpty()
		.withMessage("Поле password обязательно"),
];

// Обработчик результатов валидации
export function handleValidation(req, res, next) {
	const result = validationResult(req);
	if (result.isEmpty()) return next();
	const errors = result.array().map((e) => ({ field: e.path || e.param, message: e.msg }));
	return next(new ValidationError("Ошибка валидации данных", errors));
}

