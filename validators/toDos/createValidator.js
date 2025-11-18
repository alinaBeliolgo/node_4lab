import { body } from 'express-validator';

const createValidator = [
  body('title')
    .isString().withMessage('title должен быть строкой')
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('title обязателен (1..200)'),
  body('category_id').optional().isInt({ min: 1 }).toInt().withMessage('category_id должен быть целым положительным числом'),
  body('categoryId').optional().isInt({ min: 1 }).toInt().withMessage('categoryId должен быть целым положительным числом'),
  body('due_date').optional().isISO8601().withMessage('due_date должен быть датой (ISO-8601)'),
  body('dueDate').optional().isISO8601().withMessage('dueDate должен быть датой (ISO-8601)')
];

export default createValidator;
