import { HealthController } from '@/health/health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(() => {
    controller = new HealthController()
  })

  describe('check', () => {
    it('should return health status with service name', () => {
      const result = controller.check()

      expect(result).toEqual({
        status: 'ok',
        service: 'mock-server',
      })
    })

    it('should return an object with status property', () => {
      const result = controller.check()

      expect(result).toHaveProperty('status')
      expect(result.status).toBe('ok')
    })
  })
})
