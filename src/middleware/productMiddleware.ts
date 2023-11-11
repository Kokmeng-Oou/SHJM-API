import express from 'express'

import {
  createProductSchema,
  //   searchProductSchema,
  updateProductSchema,
  productIdSchema,
  memberAccessProductSchema,
} from '../validation/productValidation'

import { BadRequestError } from '../err'
import paginationQuerySchema from '../validation/paginationValidation'
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

    if (!req.query.keyword) {
      ;(req as any).paginationOptionsAndQuery = { result, query, options }
      next()
    }
    const word = decodeURIComponent((req.query as any).keyword)
    const keywordRegex = new RegExp(`${word.toString().trim()}`, 'i')
    ;(req as any).paginationOptionsAndQuery = {
      result,
      query,
      options,
      keywordRegex,
    }
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
    await updateProductSchema.validateAsync(req.body)
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
    await productIdSchema.validateAsync(req.params)
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
