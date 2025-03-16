import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { Env } from './env'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  })

  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })

  app.useStaticAssets(join(process.cwd(), '../../uploads/avatars'), {
    prefix: '/uploads/avatars',
  })

  await app.listen(port)
  console.log(`Server is running on port ${port}`)
}

bootstrap()
