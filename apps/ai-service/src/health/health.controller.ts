import { Controller, Get } from '@nestjs/common'

import {
  ApiHealthController,
  ApiHealthEndpoint,
} from './health.controller.swagger'

@ApiHealthController()
@Controller('health')
class HealthController {
  @Get()
  @ApiHealthEndpoint()
  check(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'ai-service',
    }
  }
}

export { HealthController }
