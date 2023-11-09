import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser {
  name: string
  email: string
  password: string
  role: string
  verificationToken: string
  isVerified: boolean
  verified: mongoose.Date
}

export interface IUserDocument extends IUser, mongoose.Document {
  isValidPassword(password: string): Promise<boolean>
}

const userSchema: mongoose.Schema<IUserDocument> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
  },
  { timestamps: true }
)

userSchema.pre<IUserDocument>('save', async function (this: IUserDocument) {
  const salt = await bcrypt.genSalt(15)
  const hash = await bcrypt.hash(this.password, salt)
  this.password = hash
})
userSchema.methods.isValidPassword = async function (password: string) {
  return bcrypt.compareSync(password, this.password)
}
// create the model for users and expose it to our app
export default mongoose.model<IUserDocument>('User', userSchema)
