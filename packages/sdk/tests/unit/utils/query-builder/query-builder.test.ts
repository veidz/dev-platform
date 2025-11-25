import { describe, expect, it } from '@jest/globals'

import {
  buildPaginationParams,
  buildQueryParams,
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
  })
})
