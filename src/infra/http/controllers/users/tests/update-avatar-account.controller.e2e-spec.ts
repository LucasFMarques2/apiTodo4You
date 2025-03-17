import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import * as path from 'path'

describe('Upload User Avatar (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await prisma.user.deleteMany({})
    await app.close()
  })

  test('[PATCH] /usuarios/upload', async () => {
    const hashedPassword = await hash('12345678', 8)

    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: hashedPassword,
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const filePath = path.join(__dirname, './fileImageTest/test-avatar.jpeg')

    const response = await request(app.getHttpServer())
      .patch('/usuarios/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', filePath)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('avatarUrl')
    expect(response.body.avatarUrl).toContain('/avatars/')
  })
})
