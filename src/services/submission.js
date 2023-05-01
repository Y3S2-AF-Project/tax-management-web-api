import { insertSubmission, getSubmissions, getSubmissionById, insertGrade } from '../repository/submission'

export const createSubmission = async ({ question, link }, { _id }) => {
  if (!(await findQuestion({ _id: question })))
    {return {
      status: 422,
      message: 'Invalid question ID'
    }}

  await insertSubmission(_id, question, link)
}

export const viewSubmissions = async (query, user) => {
  if (user.role !== 'ADMIN') {
    if (!query.filter) {query.filter = {}}
    query.filter.user = user._id
  }
  return getSubmissions(query)
}
