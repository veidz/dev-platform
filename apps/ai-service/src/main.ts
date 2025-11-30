import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('AI Service')
    .setDescription('AI service for embeddings, RAG, and AI generation')
    .setVersion('0.1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3005)
}

void bootstrap()
