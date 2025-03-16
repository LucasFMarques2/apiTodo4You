import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/database/prisma/prisma.service'
import { z } from 'zod'

const tasksBodySchema = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string(),
  tag: z.string(),
})

export type TaksBodyShema = z.infer<typeof tasksBodySchema>

@Controller('/tarefas')
@UseGuards(JwtAuthGuard)
export class CreateTasksController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: UserPayload, @Body() body: TaksBodyShema) {
    const { title, status, description, tag } = tasksBodySchema.parse(body)
    const userId = user.sub

    const taks = await this.prisma.task.create({
      data: {
        title,
        status,
        description,
        tag,
        userId,
      },
    })

    return taks
  }
}
