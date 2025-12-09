interface PaginationOptions {
  page?: number
  limit?: number
}

interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface FindManyOptions<TWhereInput, TOrderByInput>
  extends PaginationOptions {
  where?: TWhereInput
  orderBy?: TOrderByInput
}

interface BaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
  TWhereUniqueInput,
  TOrderByInput,
> {
  create(data: TCreateInput): Promise<TModel>
  findById(id: string): Promise<TModel | null>
  findUnique(where: TWhereUniqueInput): Promise<TModel | null>
  findMany(
    options?: FindManyOptions<TWhereInput, TOrderByInput>,
  ): Promise<PaginatedResult<TModel>>
  findAll(where?: TWhereInput): Promise<TModel[]>
  update(id: string, data: TUpdateInput): Promise<TModel>
  delete(id: string): Promise<TModel>
  count(where?: TWhereInput): Promise<number>
  exists(where: TWhereInput): Promise<boolean>
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export type {
  BaseRepository,
  FindManyOptions,
  PaginatedResult,
  PaginationOptions,
}
export { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT }
