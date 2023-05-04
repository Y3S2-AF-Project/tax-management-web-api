import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true
    },
    photo_url: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'GROUP'],
      default: 'GROUP',
      required: true
    },
  },
  {
    timestamps: true
  }
)

UserSchema.plugin(aggregatePaginate)

UserSchema.index({ createdAt: 1 })

const User = mongoose.model('User', UserSchema)

User.syncIndexes()

export default User
