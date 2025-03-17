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
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
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

    if (oldPassword && oldPassword.length < 8) {
      throw new UnauthorizedException(
        'A senha antiga deve ter pelo menos 8 caracteres',
      )
    }

    if (newPassword && newPassword.length < 8) {
      throw new UnauthorizedException(
        'A nova senha deve ter pelo menos 8 caracteres',
      )
    }

    if (oldPassword) {
      if (!newPassword) {
        throw new UnauthorizedException(
          'Nova senha é necessária para atualizar a senha',
        )
      }

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
