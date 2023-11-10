import express from 'express'

import {
  createProductSchema,
  searchProductSchema,
  updateProductSchema,
  productIdSchema,
  memberAccessProductSchema,
} from '../validation/productValidation'

import { BadRequestError } from '../err'
import paginationQuerySchema from '../validation/paginationvalidation'
import { fetchPaginationQuery } from '../utils/pagination'

export async function validationCreateProductSchema(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await createProductSchema.validateAsync(req.body)
    next()
  } catch (error) {
    throw new BadRequestError('Invalid data')
  }
}

export async function validationPagination(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const result = await paginationQuerySchema.validateAsync(req.query)
    const { query, options } = fetchPaginationQuery(result)
    ;(req as any).paginationOptionsAndQuery = { result, query, options }
    next()
  } catch (error) {
    throw new BadRequestError('Invalid data')
  }
}

export async function validationSearchProductSchema(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await searchProductSchema.validateAsync({ id: req.params })
    next()
  } catch (error) {
    throw new BadRequestError('Invalid data')
  }
}

export async function validationUpdateProductSchema(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await updateProductSchema.validateAsync({ body: req.body })
    next()
  } catch (error) {
    throw new BadRequestError('Invalid data')
  }
}

export async function validationProductIdSchema(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await productIdSchema.validateAsync({ body: req.body })
    next()
  } catch (error) {
    throw new BadRequestError('Invalid data')
  }
}

export async function validationMemberAccessProductSchema(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await memberAccessProductSchema.validateAsync({ body: req.body })
    next()
  } catch (error) {
    throw new BadRequestError('Invalid data')
  }
}
