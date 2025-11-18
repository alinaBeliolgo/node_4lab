import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { getTodoById } from '../model/todo.js';
import { userHasPermission } from '../model/rbac.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev-secret';

export function authRequired(req, _res, next) {
  try {
    const auth = req.headers.authorization || '';
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new AppError('Не авторизован', 401);
    }
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      throw new AppError('Неверный или просроченный токен', 401);
    }
    req.user = { userId: payload.userId, username: payload.username, role: payload.role };
    next();
  } catch (err) {
    next(err);
  }
}

export function requirePermission(code) {
  return (req, _res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Не авторизован', 401);
      }
      if (req.user.role === 'admin') {
        return next();
      }
      const allowed = userHasPermission(req.user.userId, code);
      if (!allowed) {
        throw new AppError('Недостаточно прав', 403);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function isOwnerOrAdmin(req, _res, next) {
  try {
    if (!req.user) {
      throw new AppError('Не авторизован', 401);
    }
    if (req.user.role === 'admin') {
      return next();
    }
    const todo = getTodoById(req.params.id);
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }
    if (todo.owner_id !== req.user.userId) {
      throw new AppError('Недостаточно прав', 403);
    }
    next();
  } catch (err) {
    next(err);
  }
}

export default { authRequired, requirePermission, isOwnerOrAdmin };