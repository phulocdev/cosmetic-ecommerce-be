import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { EntityNotFoundException } from 'core'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }

  findAll() {
    return `This action returns all users`
  }

  async findOne(id: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!foundUser) {
      throw new EntityNotFoundException('User', id)
    }

    return foundUser
  }

  async findByEmail(email: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email }
    })

    if (!foundUser) {
      throw new EntityNotFoundException('User', email)
    }

    return foundUser
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: string) {
    return `This action removes a #${id} user`
  }
}
