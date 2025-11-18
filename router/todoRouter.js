import express from 'express'
import * as todoController from '../controller/todoController.js'
import { authRequired, isOwnerOrAdmin, requirePermission } from '../middleware/auth.js'
import getByIdValidator from '../validators/toDos/getByIdValidator.js'
import getAllValidator from '../validators/toDos/getAllValidator.js'
import createValidator from '../validators/toDos/createValidator.js'
import updateValidator from '../validators/toDos/updateValidator.js'
import handleValidation from '../validators/handleValidationError.js'

const router = express.Router()

router.get('/', authRequired, getAllValidator, handleValidation, todoController.listTodos)
router.post('/', authRequired, requirePermission('TODO_CREATE'), createValidator, handleValidation, todoController.createTodo)

router.get('/:id', authRequired, getByIdValidator, handleValidation, isOwnerOrAdmin, todoController.getTodo)
router.put('/:id', authRequired, requirePermission('TODO_UPDATE'), getByIdValidator, updateValidator, handleValidation, isOwnerOrAdmin, todoController.updateTodo)
router.delete('/:id', authRequired, requirePermission('TODO_DELETE'), getByIdValidator, handleValidation, isOwnerOrAdmin, todoController.deleteTodo)
router.patch('/:id/toggle', authRequired, requirePermission('TODO_UPDATE'), getByIdValidator, handleValidation, isOwnerOrAdmin, todoController.toggleTodo)
export default router