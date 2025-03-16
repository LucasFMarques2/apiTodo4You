import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Update user (E2E)', () => {
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

  test('[PATCH] /usuarios/me', async () => {
    const hashedPassword = await hash('12345678', 8)

    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: hashedPassword,
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .patch('/usuarios/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Novo Nome',
        oldPassword: '12345678',
        newPassword: '123456789',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'Usuário atualizado com sucesso',
    )

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    expect(updatedUser.name).toBe('Novo Nome')
    expect(updatedUser.password).not.toBe('123456789')
  })
})
