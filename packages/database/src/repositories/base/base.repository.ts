import type { PrismaClient } from '@prisma/client'

import type {
  BaseRepository,
  FindManyOptions,
  PaginatedResult,
  PaginationOptions,
} from './base.repository.types'
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from './base.repository.types'

abstract class AbstractRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
  TWhereUniqueInput,
  TOrderByInput,
> implements
    BaseRepository<
      TModel,
      TCreateInput,
      TUpdateInput,
      TWhereInput,
      TWhereUniqueInput,
      TOrderByInput
    >
{
  constructor(protected readonly prisma: PrismaClient) {}

  protected abstract get model(): {
    create(args: { data: TCreateInput }): Promise<TModel>
    findUnique(args: { where: TWhereUniqueInput }): Promise<TModel | null>
    findMany(args: {
      where?: TWhereInput
      orderBy?: TOrderByInput
      skip?: number
      take?: number
    }): Promise<TModel[]>
    update(args: {
      where: TWhereUniqueInput
      data: TUpdateInput
    }): Promise<TModel>
    delete(args: { where: TWhereUniqueInput }): Promise<TModel>
    count(args: { where?: TWhereInput }): Promise<number>
  }

  protected abstract getIdWhereClause(id: string): TWhereUniqueInput

  async create(data: TCreateInput): Promise<TModel> {
    return this.model.create({ data })
  }

  async findById(id: string): Promise<TModel | null> {
    return this.model.findUnique({ where: this.getIdWhereClause(id) })
  }

  async findUnique(where: TWhereUniqueInput): Promise<TModel | null> {
    return this.model.findUnique({ where })
  }

  async findMany(
    options?: FindManyOptions<TWhereInput, TOrderByInput>,
  ): Promise<PaginatedResult<TModel>> {
    const { page, limit, skip } = this.normalizePagination(options)
    const where = options?.where
    const orderBy = options?.orderBy

    const [data, total] = await Promise.all([
      this.model.findMany({ where, orderBy, skip, take: limit }),
      this.model.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  async findAll(where?: TWhereInput): Promise<TModel[]> {
    return this.model.findMany({ where })
  }

  async update(id: string, data: TUpdateInput): Promise<TModel> {
    return this.model.update({
      where: this.getIdWhereClause(id),
      data,
    })
  }

  async delete(id: string): Promise<TModel> {
    return this.model.delete({ where: this.getIdWhereClause(id) })
  }

  async count(where?: TWhereInput): Promise<number> {
    return this.model.count({ where })
  }

  async exists(where: TWhereInput): Promise<boolean> {
    const count = await this.model.count({ where })
    return count > 0
  }

  protected normalizePagination(options?: PaginationOptions): {
    page: number
    limit: number
    skip: number
  } {
    const page = Math.max(options?.page ?? DEFAULT_PAGE, 1)
    const limit = Math.min(
      Math.max(options?.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    )
    const skip = (page - 1) * limit

    return { page, limit, skip }
  }
}

export { AbstractRepository }
