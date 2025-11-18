import { body } from 'express-validator';

const loginValidator = [
  body('login').trim().notEmpty().withMessage('Поле login обязательно'),
  body('password').notEmpty().withMessage('Поле password обязательно'),
];

export default loginValidator;
