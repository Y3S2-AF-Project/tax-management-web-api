import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const SubmissionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },    
    annualIncome: {
      type: Number,
      required: true
    },
    incomeDocuments: {
      type: [String],
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status:{
      type: String,
      enum: ['SUBMITTED', 'MISSING_DOCUMENTS','ACCEPTED','FALSE_DOCUMENTS'],
      default: 'SUBMITTED',
      required: true
    },
  },
  {
    timestamps: true
  }
)

SubmissionSchema.index({ createdAt: 1 })

SubmissionSchema.plugin(mongoosePaginate)

const Submission = mongoose.model('Submission', SubmissionSchema)

Submission.syncIndexes()

export default Submission
