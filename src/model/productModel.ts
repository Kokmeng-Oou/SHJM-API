import mongoose from 'mongoose'

export interface IProduct {
  brand: 'Honda' | 'Yamaha' | 'Suzuki'
  modelName: string
  image: string
  price: number
  inventory: number
  yearOfManufacture: number | 'Unknown'
  color?: string[]
  condition: number
  madeFrom: string | 'Japan'
  additionalInformation?: string
  tel: number | 'My phone'
  user: mongoose.Schema.Types.ObjectId
  permission: string
}

interface IProductDocument extends IProduct, mongoose.Document {
  _id: string
  createdAt: mongoose.Date
  updatedAt: mongoose.Date
}

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    brand: {
      type: String,
      enum: ['Honda', 'Yamaha', 'Suzuki'],
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: { type: [String], required: true },
    condition: {
      type: Number,
      required: true,
    },
    inventory: {
      type: Number,
      required: [true, 'Please provide quantity in stock'],
      default: 1,
    },
    yearOfManufacture: {
      type: String,
      required: false,
      default: 'Unknown',
    },
    madeFrom: {
      type: String,
      required: false,
      default: 'Japan',
    },
    additionalInformation: {
      type: String,
      required: false,
    },
    tel: {
      type: String,
      required: false,
      default: 'My phone',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a admin'],
    },
    permission: {
      type: String,
      enum: ['guest', 'member', 'admin'],
      default: 'guest',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('products', productSchema)
