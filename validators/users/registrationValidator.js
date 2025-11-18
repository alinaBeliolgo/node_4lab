import { body } from 'express-validator';

const registrationValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('username должен быть от 3 до 50 символов'),
  body('email')
    .trim()
    .isEmail().withMessage('Некорректный email')
    .isLength({ max: 100 }).withMessage('email слишком длинный'),
  body('password')
    .isLength({ min: 6 }).withMessage('Пароль минимум 6 символов'),
  body('role')
    .optional()
    .isIn(['user','admin']).withMessage("role должен быть 'user' или 'admin'")
];

export default registrationValidator;
