// main.ts - bootstrap for api-gateway (NestJS placeholder)
// NOTE: Implementation intentionally minimal until dependencies installed.
import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(3001)
}

void bootstrap()
