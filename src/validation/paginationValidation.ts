import Joi from 'joi'

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().max(9).default(9),
  sort: Joi.string().valid('modelName', 'price').default('modelName'),
  order: Joi.string().valid('asc', 'desc').default('asc'),
  keyword: Joi.string().min(1).optional(),
  filter: Joi.object({
    color: Joi.string().valid('red', 'green', 'blue', 'black', 'white'),
    brand: Joi.string().valid('Honda', 'Yamaha'),
    condition: Joi.number().integer().min(1).max(100),
    yearOfManufacture: Joi.number().integer().min(2000).max(2023),
    price: Joi.object({
      min: Joi.number().positive(),
      max: Joi.number().positive().greater(Joi.ref('min')),
    }),
  }),
})

export default paginationQuerySchema
