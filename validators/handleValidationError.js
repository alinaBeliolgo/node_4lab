import { validationResult } from 'express-validator';
import { ValidationError } from '../errors/ValidationError.js';

export default function handleValidationError(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map(e => ({ field: e.path || e.param, message: e.msg }));
  next(new ValidationError('Ошибка валидации данных', errors));
}
