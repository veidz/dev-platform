import type { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

type PrismaClientMock = DeepMockProxy<PrismaClient>

const createPrismaClientMock = (): PrismaClientMock => {
  return mockDeep<PrismaClient>()
}

export type { PrismaClientMock }
export { createPrismaClientMock }
