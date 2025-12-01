import { ApiStatus, HttpMethod, Role } from '@prisma/client'

describe('Enum values', () => {
  describe('Role enum', () => {
    it('should have correct Role values', () => {
      expect(Role.OWNER).toBe('OWNER')
      expect(Role.ADMIN).toBe('ADMIN')
      expect(Role.DEVELOPER).toBe('DEVELOPER')
      expect(Role.VIEWER).toBe('VIEWER')
    })
  })

  describe('ApiStatus enum', () => {
    it('should have correct ApiStatus values', () => {
      expect(ApiStatus.ACTIVE).toBe('ACTIVE')
      expect(ApiStatus.INACTIVE).toBe('INACTIVE')
      expect(ApiStatus.DEPRECATED).toBe('DEPRECATED')
    })
  })

  describe('HttpMethod enum', () => {
    it('should have correct HttpMethod values', () => {
      expect(HttpMethod.GET).toBe('GET')
      expect(HttpMethod.POST).toBe('POST')
      expect(HttpMethod.PUT).toBe('PUT')
      expect(HttpMethod.PATCH).toBe('PATCH')
      expect(HttpMethod.DELETE).toBe('DELETE')
      expect(HttpMethod.HEAD).toBe('HEAD')
      expect(HttpMethod.OPTIONS).toBe('OPTIONS')
    })
  })
})
