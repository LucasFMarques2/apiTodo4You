import {
  Controller,
  Put,
  UseGuards,
  Param,
  Body,
  NotFoundException,
  HttpCode,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'
import { TaksBodyShema } from './create-tasks.controller'

@Controller('tarefas/:id')
export class UpdateTasksController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async handle(@Param('id') id: string, @Body() data: TaksBodyShema) {
    const taskExists = await this.prisma.task.findFirst({
      where: { id },
    })

    if (!taskExists) {
      throw new NotFoundException('Tarefa não encontrada')
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
    })

    return updatedTask
  }
}
