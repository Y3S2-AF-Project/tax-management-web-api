import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const EmployeeSchema = new Schema(
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
    role: {
      type: String,
      required: true
    },
    permissions: {
      type: [String],
      default: []
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
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
    }
  },
  {
    timestamps: true
  }
)

EmployeeSchema.index({ createdAt: 1 })

EmployeeSchema.plugin(mongoosePaginate)

const Employee = model('SystemEmployee', EmployeeSchema)

export default Employee
