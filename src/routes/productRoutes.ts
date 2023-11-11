import express from 'express'
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchSingleProduct,
  memberAccessProducts,
  searchProduct,
  updateProduct,
} from '../controller/productController'

import {
  authenticationUser,
  authorizePermissions,
} from '../middleware/authenticationMiddleware'

import {
  validationCreateProductSchema,
  validationPagination,
  validationProductIdSchema,
  validationUpdateProductSchema,
} from '../middleware/productMiddleware'

const router = express.Router()

router
  .route('/')
  .get(validationPagination, fetchAllProducts)
  .post(
    [
      authenticationUser,
      authorizePermissions('admin'),
      validationCreateProductSchema,
    ],
    createProduct
  )
router.get('/search', validationPagination, searchProduct)
router.get(
  `/${process.env.MEMBER_ACCESS}`,
  [authenticationUser, authorizePermissions('member')],
  memberAccessProducts
) // last
router
  .route('/:id')
  .get(fetchSingleProduct)
  .patch(
    [
      authenticationUser,
      authorizePermissions('admin'),
      validationProductIdSchema,
      validationUpdateProductSchema,
    ],
    updateProduct
  )
  .delete(
    [
      authenticationUser,
      authorizePermissions('admin'),
      validationProductIdSchema,
    ],
    deleteProduct
  )

export default router
