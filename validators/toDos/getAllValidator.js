import { query } from 'express-validator';

const allowedSortFields = ['created_at', 'due_date', 'title'];
const allowedOrders = ['asc', 'desc'];

const getAllValidator = [
  query('category').optional().isInt({ min: 1 }).toInt().withMessage('category должен быть целым положительным числом'),
  query('search').optional().isString().trim().isLength({ max: 200 }).withMessage('search слишком длинный'),
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page должен быть >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('limit 1..100'),
  query('sort').optional().custom((value) => {
    const [field, order] = String(value).split(':');
    if (!allowedSortFields.includes(field)) return false;
    if (order && !allowedOrders.includes(order.toLowerCase())) return false;
    return true;
  }).withMessage("sort должен быть в формате 'field:asc|desc', где field: created_at|due_date|title")
];

export default getAllValidator;
