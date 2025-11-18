import { body } from 'express-validator';

const createValidator = [
  body('name')
    .isString().withMessage('name должен быть строкой')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Имя категории должно быть от 2 до 100 символов')
];

export default createValidator;
