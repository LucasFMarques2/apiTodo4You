import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/database/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessao')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    if (!email || !password) {
      throw new NotFoundException('Campo email e/ou senha vazio')
    }

    if (password.length < 8) {
      throw new UnauthorizedException(
        'A senha deve ter pelo menos 8 caracteres',
      )
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválido')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email e/ou senha inválido')
    }

    const AcessToken = this.jwt.sign({ sub: user.id })

    return {
      acessToken: AcessToken,
      user,
    }
  }
}
