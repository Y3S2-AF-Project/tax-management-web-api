import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const TaxAgentSchema = new Schema(
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
    { timestamps: true }
)

TaxAgentSchema.index({ createdAt: 1 })

TaxAgentSchema.plugin(mongoosePaginate)

const TaxAgent = model('TaxAgent', TaxAgentSchema)

TaxAgent.syncIndexes()

export default TaxAgent

