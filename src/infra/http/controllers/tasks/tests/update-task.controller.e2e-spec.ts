import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Update task (E2E)', () => {
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

  test('[PUT] /tarefas/:id', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '12345678',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.task.createMany({
      data: [
        {
          title: 'Nova tarefa 01',
          description: 'Tarefa teste',
          status: 'pendente',
          tag: 'teste',
          userId: user.id,
        },
        {
          title: 'Nova tarefa 02',
          description: 'Tarefa teste',
          status: 'pendente',
          tag: 'teste',
          userId: user.id,
        },
      ],
    })

    const firstTask = await prisma.task.findFirst({
      where: {
        userId: user.id,
      },
    })

    const taskId = firstTask?.id

    const response = await request(app.getHttpServer())
      .put(`/tarefas/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Atualizando nova tarefa' })

    expect(response.statusCode).toBe(200)
  })
})
