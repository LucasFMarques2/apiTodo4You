import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'
import {
  Controller,
  HttpCode,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../../config/multerConfig'

@Controller('usuarios')
export class UploadFileAccountController {
  constructor(private prisma: PrismaService) {}

  @Patch('upload')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async handle(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user.id || req.user.sub

    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.')
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.')
    }

    const avatarPath = `avatars/${file.filename}`

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarPath },
    })

    const avatarUrl = `${process.env.APP_URL || 'http://localhost:3333'}/${avatarPath}`

    return {
      avatarUrl,
    }
  }
}
