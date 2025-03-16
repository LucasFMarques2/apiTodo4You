import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch list of tasks (E2E)', () => {
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

  test('[GET] /tarefas', async () => {
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

    const response = await request(app.getHttpServer())
      .get('/tarefas')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      tasks: [
        expect.objectContaining({ title: 'Nova tarefa 01' }),
        expect.objectContaining({ title: 'Nova tarefa 02' }),
      ],
    })
  })
})
