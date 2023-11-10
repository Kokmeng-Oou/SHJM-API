import mongoose from 'mongoose'

interface IToken {
  refreshToken: string
  ip: string
  userAgent: string
  isValid: boolean
  user: mongoose.ObjectId
}

interface ITokenDocument extends IToken {
  _id: any
  createdAt: Date
}

const tokenSchema = new mongoose.Schema<ITokenDocument>(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      required: false,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('token', tokenSchema)
