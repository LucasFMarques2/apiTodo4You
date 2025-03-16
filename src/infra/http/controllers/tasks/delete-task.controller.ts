import { Controller, Delete, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'

@Controller('tarefas')
export class DeleteTasksController {
  constructor(private prisma: PrismaService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return {
        message: 'Tarefa não encontrada',
      }
    }

    await this.prisma.task.delete({
      where: { id },
    })

    return {
      message: 'Tarefa deletada com sucesso',
    }
  }
}
