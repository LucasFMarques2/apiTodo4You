import {
  Body,
  Controller,
  Patch,
  UnauthorizedException,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common'
import { PrismaService } from '@/database/prisma/prisma.service'
import { hash, compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

const UpdateAccountSchema = z.object({
  name: z.string().optional(),
  oldPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
})
export type updateAccountSchemaType = z.infer<typeof UpdateAccountSchema>

@Controller('/usuarios')
export class UpdateAccountController {
  constructor(private prisma: PrismaService) {}

  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(UpdateAccountSchema))
  async handle(@Request() req, @Body() body: updateAccountSchemaType) {
    const { name, oldPassword, newPassword } = UpdateAccountSchema.parse(body)
    const tokenUser = req.user
    const userId = tokenUser.id || tokenUser.sub
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado')
    }
    if (newPassword && !oldPassword) {
      throw new UnauthorizedException(
        'Senha antiga é necessária para atualizar a senha',
      )
    }
    if (oldPassword && newPassword) {
      const userFromDb = await this.prisma.user.findUnique({
        where: { id: userId },
      })
      if (!userFromDb || !userFromDb.password) {
        throw new UnauthorizedException('Senha do usuário não encontrada')
      }
      const isOldPasswordCorrect = await compare(
        oldPassword,
        userFromDb.password,
      )
      if (!isOldPasswordCorrect) {
        throw new UnauthorizedException('A senha antiga está incorreta')
      }
      const hashedNewPassword = await hash(newPassword, 8)
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      })
    }
    if (name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name },
      })
    }
    return { message: 'Usuário atualizado com sucesso' }
  }
}
