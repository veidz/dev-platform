import { describe, expect, it } from '@jest/globals'

import { buildQueryParams } from '@/utils/query-builder/query-builder'

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
  })
})
