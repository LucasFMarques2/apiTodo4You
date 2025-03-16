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
  async handle(@UploadedFile() file, @Request() req) {
    const userId = req.user.id || req.user.sub

    const avatarPath = `avatars/${file.filename}`

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarPath },
    })

    return {
      avatarUrl: `${process.env.APP_URL}/uploads/${avatarPath}`,
    }
  }
}
