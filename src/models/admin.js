import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const AdminSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    permissions: {
      type: [String],
      default: []
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    },
    isFirstLogin: {
      type: Boolean,
      required: false,
      default: true
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false
    },
    avatar: {
      type: String,
      required: false
    },
    secret: {
      type: String,
      required: false
    },
    choosenOTPMethod: {
      type: String,
      required: false,
      default: ''
    }
  },
  { timestamps: true }
)

AdminSchema.index({ createdAt: 1 })

AdminSchema.plugin(mongoosePaginate)

const Admin = model('Admin', AdminSchema)

Admin.syncIndexes()

export default Admin
