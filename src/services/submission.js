import { insertSubmission, getSubmissions, getSubmissionById, insertGrade } from '../repository/submission'

export const createSubmission = async ({ annualIncome, incomeDocuments},{_id}) => {
  await insertSubmission(_id, annualIncome, incomeDocuments)
}

export const viewSubmissions = async (query, user) => {
  if (user.role !== 'ADMIN') {
    if (!query.filter) {query.filter = {}}
    query.filter.user = user._id
  }
  return getSubmissions(query)
}
