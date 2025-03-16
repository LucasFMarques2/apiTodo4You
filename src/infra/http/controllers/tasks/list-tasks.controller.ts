import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'

@Controller('tarefas')
export class ListTasksController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle() {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { tasks }
  }
}
