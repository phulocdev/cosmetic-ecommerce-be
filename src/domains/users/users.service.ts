import { Injectable } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { NotFoundError } from 'rxjs'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: string) {
    const foundUser = this.prismaService.user.findUnique({
      where: { id }
    })

    if (!foundUser) {
      throw new NotFoundError('User not found')
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
