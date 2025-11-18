import * as categoryModel from "../model/category.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { DatabaseError } from "../errors/DatabaseError.js";

export function listCategories(req, res, next) {
  try {
    const categories = categoryModel.getAllCategories();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
}

export function getCategory(req, res, next) {
  try {
    const category = categoryModel.getCategoryById(Number(req.params.id));

    if (!category) {
      throw new NotFoundError("Категория не найдена!");
    }

    res.json({ data: category });
  } catch (error) {
    next(error);
  }
}

export function createCategory(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError();
    }
    const { name } = req.body;
    // Эту проверку выполняет валидатор, но на всякий случай вернём корректную ошибку
    if (!name || name.length < 2 || name.length > 100) {
      throw new ValidationError("Имя категории должно быть от 2 до 100 символов");
    }

    const category = categoryModel.createCategory({ name: name.trim() });
    res.status(201).json({ data: category });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      error.statusCode = 409;
      error.message = "Категория с таким именем уже существует";
      return next(error);
    }
    return next(new DatabaseError(error.message));
  }
}

export function updateCategory(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError();
    }
    const { name } = req.body;
    const id = Number(req.params.id);

    if (!name || name.length < 2 || name.length > 100) {
      throw new ValidationError("Имя категории должно быть от 2 до 100 символов");
    }

    const updated = categoryModel.updateCategory(id, { name: name.trim() });

    if (!updated) {
      throw new NotFoundError("Категория не найдена!");
    }

    res.json({ data: updated });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      error.statusCode = 409;
      error.message = "Категория с таким именем уже существует";
      return next(error);
    }
    return next(new DatabaseError(error.message));
  }
}

export function deleteCategory(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError();
    }
    const id = Number(req.params.id);
    const deleted = categoryModel.deleteCategory(id);

    if (!deleted) {
      throw new NotFoundError("Категория не найдена!");
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
