import * as categoryModel from "../model/category.js";
import * as todoModel from "../model/todo.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { ValidationError } from "../errors/ValidationError.js";

export function listTodos(req, res, next) {
  try {
    console.log("listTodos called with query:", req.query);
    const {
      category,
      search,
      page = 1,
      limit = 10,
      sort = "created_at:desc",
    } = req.query;

    const [sortBy, sortOrder] = sort.split(":");

    const canReadAll = req.user?.role === 'admin';
    const filters = {
      categoryId: category ? Number(category) : undefined,
      search,
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
      userId: canReadAll ? undefined : req.user?.userId,
    };

    const { rows, total } = todoModel.listTodos(filters);
    const totalPages = total > 0 ? Math.ceil(total / filters.limit) : 0;

    res.json({
      data: rows,
      meta: {
        total,
        count: rows.length,
        limit: filters.limit,
        pages: totalPages,
        currentPage: filters.page,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function getTodo(req, res, next) {
  try {
    const todo = todoModel.getTodoById(req.params.id);

    if (!todo) {
      throw new NotFoundError("Todo not found");
    }

    if (req.user?.role !== 'admin' && todo.owner_id !== req.user?.userId) {
      throw new ForbiddenError();
    }

    res.json({ data: todo });
  } catch (error) {
    next(error);
  }
}

export function createTodo(req, res, next) {
  try {
    const { title } = req.body;
    const categoryId =
      req.body.category_id !== undefined ? Number(req.body.category_id) : req.body.categoryId;
    const dueDate = req.body.due_date ?? req.body.dueDate;

    if (categoryId !== undefined && categoryId !== null) {
      const exists = categoryModel.categoryExists(Number(categoryId));
      if (!exists) {
        throw new NotFoundError("Category not found");
      }
    }

    const todo = todoModel.createTodo({
      title: title.trim(),
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      dueDate,
      userId: req.user.userId,
    });

    res.status(201).json({ data: todo });
  } catch (error) {
    next(error);
  }
}

export function updateTodo(req, res, next) {
  try {
    const title = req.body.title;
    const completed = req.body.completed;
    const categoryId =
      req.body.category_id !== undefined ? Number(req.body.category_id) : req.body.categoryId;
    const dueDate = req.body.due_date ?? req.body.dueDate;

    if (
      title === undefined &&
      completed === undefined &&
      categoryId === undefined &&
      dueDate === undefined
    ) {
      throw new ValidationError("Не указано ни одно поле для обновления");
    }

    if (categoryId !== undefined && categoryId !== null) {
      const exists = categoryModel.categoryExists(Number(categoryId));
      if (!exists) {
        throw new NotFoundError("Category not found");
      }
    }

    // проверим право владения для обычного пользователя
    if (req.user?.role !== 'admin') {
      const existing = todoModel.getTodoById(req.params.id);
      if (!existing) {
        throw new NotFoundError('Todo not found');
      }
      if (existing.owner_id !== req.user?.userId) {
        throw new ForbiddenError();
      }
    }

    const updated = todoModel.updateTodo(req.params.id, {
      title: title !== undefined ? title.trim() : undefined,
      completed,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      dueDate,
    });

    if (!updated) {
      throw new NotFoundError("Todo not found");
    }

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
}

export function toggleTodo(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      const existing = todoModel.getTodoById(req.params.id);
      if (!existing) {
        throw new NotFoundError('Todo not found');
      }
      if (existing.owner_id !== req.user?.userId) {
        throw new ForbiddenError();
      }
    }

    const updated = todoModel.toggleTodo(req.params.id);

    if (!updated) {
      throw new NotFoundError("Todo not found");
    }

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
}

export function deleteTodo(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      const existing = todoModel.getTodoById(req.params.id);
      if (!existing) {
        throw new NotFoundError('Todo not found');
      }
      if (existing.owner_id !== req.user?.userId) {
        throw new ForbiddenError();
      }
    }

    const deleted = todoModel.deleteTodo(req.params.id);

    if (!deleted) {
      throw new NotFoundError("Todo not found");
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
