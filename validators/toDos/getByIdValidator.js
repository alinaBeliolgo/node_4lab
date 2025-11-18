import { param } from 'express-validator';

// В БД todo.id — UUID, проверяем формат UUID
const getByIdValidator = [
  param('id').isUUID().withMessage('id должен быть UUID')
];

export default getByIdValidator;
