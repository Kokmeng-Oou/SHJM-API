export const meta = (validateQuery: any, count: number) => {
  return {
    page: validateQuery.page,
    limit: validateQuery.limit,
    sort: validateQuery.sort,
    filter: validateQuery.filter,
    total: count,
    pages: Math.ceil(count / validateQuery.limit),
  }
}
