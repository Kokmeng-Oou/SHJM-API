import express from 'express'
import { StatusCodes } from 'http-status-codes'
import productModel from '../model/productModel'
import { BadRequestError } from '../err'

export const createProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    req.body.user = (req as any).user.id
    const newProduct = await productModel.create({ ...req.body })
    if (!newProduct) throw new BadRequestError('Failed to create a new product')
    res
      .status(StatusCodes.CREATED)
      .json({ status: 'success', msg: 'success create a new product' })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error })
  }
}

export const fetchAllProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { result, query, options } = (req as any).paginationOptionsAndQuery
    const fetchProducts = await productModel.find(query, {}, options)
    const count = await productModel.countDocuments(query)
    if (!fetchProducts || !fetchProducts[0])
      throw new BadRequestError('No products found!')
    const { meta } = await import('../utils/meta')
    const MetaResult = meta(result, count)
    res
      .status(StatusCodes.OK)
      .json({ status: 'success', data: fetchProducts, meta: MetaResult })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: ' server could not understand the request due to invalid syntax.',
    })
  }
}

export const fetchSingleProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res.send('fetch single product')
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error })
  }
}

export const searchProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res.send('search product')
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error })
  }
}

export const updateProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const productsId = req.params?.id
    if (!productsId) throw new BadRequestError('Please provide valid product')
    const findProducts = await productModel.findOne({ _id: productsId })
    if (!findProducts) throw new BadRequestError('product does not exist')
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: findProducts._id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!updateProduct)
      throw new BadRequestError('Failed to update the product')
    res
      .status(StatusCodes.ACCEPTED)
      .json({ status: 'success', data: updateProduct })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error })
  }
}

export const deleteProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const productsId = req.params?.id
    if (!productsId) throw new BadRequestError('Invalid request')
    const findProducts = await productModel.findOne({ _id: productsId })
    const deletedProduct = await productModel.deleteOne({
      _id: (findProducts as any)._id,
    })
    if (!deletedProduct)
      throw new BadRequestError('Failed to delete the product')
    res
      .status(StatusCodes.OK)
      .json({ status: 'Successfully deleted the product' })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error })
  }
}

export const memberAccessProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res.send('member access products')
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error })
  }
}