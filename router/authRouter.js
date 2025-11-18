import express from 'express';
import * as authController from '../controller/authController.js';
import { authRequired } from '../middleware/auth.js';
import registrationValidator from '../validators/users/registrationValidator.js';
import loginValidator from '../validators/users/loginValidator.js';
import handleValidation from '../validators/handleValidationError.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registrationValidator, handleValidation, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, handleValidation, authController.login);

// GET /api/auth/profile
router.get('/profile', authRequired, authController.profile);

export default router;
