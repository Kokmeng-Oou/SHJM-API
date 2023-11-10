// Import Joi module
import Joi from 'joi'

// Define the product schema
export const createProductSchema = Joi.object({
  brand: Joi.string().valid('Honda', 'Yamaha', 'Suzuki').required(),
  modelName: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().positive().required(),
  inventory: Joi.number().integer().min(0).required(),
  yearOfManufacture: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().valid('Unknown'))
    .required(),
  color: Joi.array().items(Joi.string()),
  condition: Joi.number().min(0).max(100).required(),
  madeFrom: Joi.alternatives()
    .try(Joi.string(), Joi.string().valid('Japan'))
    .required(),
  additionalInformation: Joi.string().optional(),
  tel: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().valid('My phone'))
    .required(),
  permission: Joi.string().valid('guest', 'member').required(),
})

export const updateProductSchema = Joi.object({
  brand: Joi.string().valid('Honda', 'Yamaha', 'Suzuki').optional(),
  modelName: Joi.string().optional(),
  image: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  inventory: Joi.number().integer().min(0).optional(),
  yearOfManufacture: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().valid('Unknown'))
    .optional(),
  color: Joi.array().items(Joi.string()).optional(),
  condition: Joi.number().min(0).max(100).optional(),
  madeFrom: Joi.alternatives()
    .try(Joi.string(), Joi.string().valid('Japan'))
    .optional(),
  additionalInformation: Joi.string().optional(),
  tel: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().valid('My phone'))
    .optional(),
  permission: Joi.string().valid('guest', 'member').optional(),
})

// delete /  fetchSingleProduct
export const productIdSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
})

// check user id
export const memberAccessProductSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
  role: Joi.string().valid('member').required(),
})
