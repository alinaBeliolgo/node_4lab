import { body } from 'express-validator';

const updateValidator = [
  // Должно быть хотя бы одно поле для обновления
  body('*').custom((_, { req }) => {
    const { title, completed, category_id, categoryId, due_date, dueDate } = req.body || {};
    if (
      title === undefined && completed === undefined &&
      category_id === undefined && categoryId === undefined &&
      due_date === undefined && dueDate === undefined
    ) {
      throw new Error('Не указано ни одно поле для обновления');
    }
    return true;
  }),
  body('title').optional().isString().trim().isLength({ min: 1, max: 200 }).withMessage('title 1..200'),
  body('completed').optional().isBoolean().withMessage('completed должен быть boolean').toBoolean(),
  body('category_id').optional().isInt({ min: 1 }).toInt().withMessage('category_id должен быть целым положительным числом'),
  body('categoryId').optional().isInt({ min: 1 }).toInt().withMessage('categoryId должен быть целым положительным числом'),
  body('due_date').optional().isISO8601().withMessage('due_date должен быть датой (ISO-8601)'),
  body('dueDate').optional().isISO8601().withMessage('dueDate должен быть датой (ISO-8601)')
];

export default updateValidator;
