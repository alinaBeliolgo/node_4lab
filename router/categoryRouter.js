import express from 'express'
import * as categoryController from '../controller/categoryController.js'
import { authRequired, requirePermission } from '../middleware/auth.js'
import getByIdValidator from '../validators/categories/getByIdValidator.js'
import createValidator from '../validators/categories/createValidator.js'
import updateValidator from '../validators/categories/updateValidator.js'
import handleValidation from '../validators/handleValidationError.js'

const router = express.Router()

router.get('/', authRequired, categoryController.listCategories)
router.post('/', authRequired, requirePermission('CATEGORY_CREATE'), createValidator, handleValidation, categoryController.createCategory)

router.get('/:id', authRequired, getByIdValidator, handleValidation, categoryController.getCategory)
router.put('/:id', authRequired, requirePermission('CATEGORY_UPDATE'), getByIdValidator, updateValidator, handleValidation, categoryController.updateCategory)
router.delete('/:id', authRequired, requirePermission('CATEGORY_DELETE'), getByIdValidator, handleValidation, categoryController.deleteCategory)

export default router