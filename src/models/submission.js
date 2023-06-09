import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const SubmissionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    link: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: false
    },
    graded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
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
