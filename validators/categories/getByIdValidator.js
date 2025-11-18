import { param } from 'express-validator';

const getByIdValidator = [
  param('id').isInt({ min: 1 }).toInt().withMessage('id должен быть целым положительным числом')
];

export default getByIdValidator;
