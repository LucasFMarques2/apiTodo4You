import {
  Body,
  Controller,
  Post,
  ConflictException,
  HttpCode,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/database/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'

const CreateAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

export type accountShemaType = z.infer<typeof CreateAccountSchema>

@Controller('/usuarios')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateAccountSchema))
  async handle(@Body() body: accountShemaType) {
    const { name, email, password } = CreateAccountSchema.parse(body)

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('Esse email de usuário já existe')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
