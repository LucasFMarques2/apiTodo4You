import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create task (E2E)', () => {
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

  test('[POST] /tarefas', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '12345678',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/tarefas')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Nova tarefa',
        description: 'Tarefa teste',
        status: 'pendente',
        tag: 'teste',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.task.findFirst({
      where: {
        title: 'Nova tarefa',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
