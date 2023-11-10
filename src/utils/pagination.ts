type paginationObject = {
  page: number
  limit: number
  sort: string
  order: string
  filter: {
    color: string
    brand: string
    condition: number
    yearOfManufacture: number
    price: {
      min: number
      max: number
    }
  }
}

export const fetchPaginationQuery = ({
  page,
  limit,
  sort,
  order,
  filter,
}: paginationObject) => {
  // calculate the offset and query option
  const offset = (page - 1) * limit
  const options = {
    skip: offset,
    limit: limit,
    sort: { [sort]: order === 'asc' ? 1 : -1 },
  }
  if (!filter) return { options }
  // Build the query based on the filter
  const query: any = {}
  if (filter.color) query.color = filter.color
  if (filter.brand) query.brand = filter.brand
  if (filter.condition) query.condition = filter.condition
  if (filter.yearOfManufacture)
    query.yearOfManufacture = filter.yearOfManufacture
  if (filter?.price)
    query.price = { $gte: filter.price.min, $lte: filter.price.max }
  return { query, options }
}
