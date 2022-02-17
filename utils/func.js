export const list = (req) => {
  const page = req.query.page
  const limit = req.query.limit ? req.params.limit : 20
  const user = req.user

  const skip = (page - 1) * limit
  const take = limit + 1

  return { page, limit, skip, take, user }
}
