import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserById, getUserWithPasswordByLogin, createUser } from '../model/user.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { DatabaseError } from '../errors/DatabaseError.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function register(req, res, next) {
  const { username, email, password, role } = req.body;
  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    try {
      const user = createUser({
        username: username.trim(),
        email: email.trim(),
        passwordHash,
        role: role === 'admin' ? 'admin' : 'user'
      });
      return res.status(201).json({ data: user });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return next(new ValidationError('Пользователь уже существует', [
          { field: 'username', message: 'Занято' },
          { field: 'email', message: 'Занято' }
        ]));
      }
      return next(new DatabaseError(error.message));
    }
  } catch (err) {
    return next(err);
  }
}

export function login(req, res, next) {
  const { login, password } = req.body;
  try {
    const userRow = getUserWithPasswordByLogin(login.trim());
    if (!userRow) {
      throw new AuthenticationError('Неверные учетные данные');
    }
    const ok = bcrypt.compareSync(password, userRow.password);
    if (!ok) {
      throw new AuthenticationError('Неверные учетные данные');
    }
    const token = jwt.sign({ userId: userRow.id, username: userRow.username, role: userRow.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}

export function profile(req, res, next) {
  try {
    if (!req.user) {
      throw new AuthenticationError('Не авторизован');
    }
    const user = getUserById(req.user.userId);
    return res.json({ data: user });
  } catch (err) {
    return next(err);
  }
}
