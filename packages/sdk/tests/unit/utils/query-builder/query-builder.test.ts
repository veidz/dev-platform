import { describe, expect, it } from '@jest/globals'

import {
  buildFilterParams,
  buildPaginationParams,
  buildQueryParams,
  buildSortParams,
} from '@/utils/query-builder/query-builder'

describe('query-builder', () => {
  describe('buildQueryParams', () => {
    it('should build query params from mixed types', () => {
      const params = {
        name: 'test',
        age: 25,
        active: true,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        name: 'test',
        age: '25',
        active: 'true',
        createdAt: '2024-01-01T00:00:00.000Z',
      })
    })

    it('should skip undefined values', () => {
      const params = {
        name: 'test',
        age: undefined,
        active: true,
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        name: 'test',
        active: 'true',
      })
      expect(result).not.toHaveProperty('age')
    })

    it('should skip null values', () => {
      const params = {
        name: 'test',
        age: null as unknown as undefined,
        active: true,
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        name: 'test',
        active: 'true',
      })
      expect(result).not.toHaveProperty('age')
    })

    it('should convert boolean false to string', () => {
      const params = {
        active: false,
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        active: 'false',
      })
    })

    it('should convert number zero to string', () => {
      const params = {
        count: 0,
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        count: '0',
      })
    })

    it('should handle empty params', () => {
      const params = {}

      const result = buildQueryParams(params)

      expect(result).toEqual({})
    })

    it('should handle pagination and sort params together', () => {
      const params = {
        page: 2,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc' as const,
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        page: '2',
        limit: '50',
        sortBy: 'name',
        sortOrder: 'asc',
      })
    })
  })

  describe('buildPaginationParams', () => {
    it('should build pagination params with page and limit', () => {
      const params = {
        page: 1,
        limit: 10,
      }

      const result = buildPaginationParams(params)

      expect(result).toEqual({
        page: '1',
        limit: '10',
      })
    })

    it('should build pagination params with only page', () => {
      const params = {
        page: 2,
      }

      const result = buildPaginationParams(params)

      expect(result).toEqual({
        page: '2',
      })
      expect(result).not.toHaveProperty('limit')
    })

    it('should build pagination params with only limit', () => {
      const params = {
        limit: 50,
      }

      const result = buildPaginationParams(params)

      expect(result).toEqual({
        limit: '50',
      })
      expect(result).not.toHaveProperty('page')
    })

    it('should handle empty pagination params', () => {
      const params = {}

      const result = buildPaginationParams(params)

      expect(result).toEqual({})
    })

    it('should convert page zero to string', () => {
      const params = {
        page: 0,
        limit: 10,
      }

      const result = buildPaginationParams(params)

      expect(result).toEqual({
        page: '0',
        limit: '10',
      })
    })

    it('should skip undefined values', () => {
      const params = {
        page: 1,
        limit: undefined,
      }

      const result = buildPaginationParams(params)

      expect(result).toEqual({
        page: '1',
      })
      expect(result).not.toHaveProperty('limit')
    })
  })

  describe('buildSortParams', () => {
    it('should build sort params with sortBy and sortOrder', () => {
      const params = {
        sortBy: 'name',
        sortOrder: 'asc' as const,
      }

      const result = buildSortParams(params)

      expect(result).toEqual({
        sortBy: 'name',
        sortOrder: 'asc',
      })
    })

    it('should build sort params with only sortBy', () => {
      const params = {
        sortBy: 'createdAt',
      }

      const result = buildSortParams(params)

      expect(result).toEqual({
        sortBy: 'createdAt',
      })
      expect(result).not.toHaveProperty('sortOrder')
    })

    it('should build sort params with only sortOrder', () => {
      const params = {
        sortOrder: 'desc' as const,
      }

      const result = buildSortParams(params)

      expect(result).toEqual({
        sortOrder: 'desc',
      })
      expect(result).not.toHaveProperty('sortBy')
    })

    it('should handle empty sort params', () => {
      const params = {}

      const result = buildSortParams(params)

      expect(result).toEqual({})
    })

    it('should handle asc sort order', () => {
      const params = {
        sortBy: 'id',
        sortOrder: 'asc' as const,
      }

      const result = buildSortParams(params)

      expect(result).toEqual({
        sortBy: 'id',
        sortOrder: 'asc',
      })
    })

    it('should handle desc sort order', () => {
      const params = {
        sortBy: 'id',
        sortOrder: 'desc' as const,
      }

      const result = buildSortParams(params)

      expect(result).toEqual({
        sortBy: 'id',
        sortOrder: 'desc',
      })
    })
  })

  describe('buildFilterParams', () => {
    it('should build filter params from mixed types', () => {
      const filters = {
        status: 'active',
        count: 10,
        enabled: true,
        date: new Date('2024-01-01T00:00:00.000Z'),
      }

      const result = buildFilterParams(filters)

      expect(result).toEqual({
        status: 'active',
        count: '10',
        enabled: 'true',
        date: '2024-01-01T00:00:00.000Z',
      })
    })

    it('should skip undefined values', () => {
      const filters = {
        status: 'active',
        count: undefined,
        enabled: true,
      }

      const result = buildFilterParams(filters)

      expect(result).toEqual({
        status: 'active',
        enabled: 'true',
      })
      expect(result).not.toHaveProperty('count')
    })

    it('should skip null values', () => {
      const filters = {
        status: 'active',
        count: null as unknown as undefined,
        enabled: true,
      }

      const result = buildFilterParams(filters)

      expect(result).toEqual({
        status: 'active',
        enabled: 'true',
      })
      expect(result).not.toHaveProperty('count')
    })
  })
})
