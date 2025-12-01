import { ApiStatus, Role } from '@prisma/client'

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
})
