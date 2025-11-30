import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

function ApiHealthEndpoint(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Health check endpoint' }),
    ApiResponse({
      status: 200,
      description: 'Service is healthy',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          service: { type: 'string', example: 'mock-server' },
        },
      },
    }),
  )
}

function ApiHealthController(): ReturnType<typeof applyDecorators> {
  return applyDecorators(ApiTags('health'))
}

export { ApiHealthController, ApiHealthEndpoint }
