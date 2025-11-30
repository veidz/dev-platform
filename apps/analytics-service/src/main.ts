import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Analytics Service')
    .setDescription('Analytics service for metrics, events, and monitoring')
    .setVersion('0.1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3004)
}

void bootstrap()
