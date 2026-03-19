import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { EntityNotFoundException, OffsetPaginatedResponseDto } from 'core'
import { PrismaService } from 'database/prisma/prisma.service'
import { User } from 'types'
import { generateUserCode } from 'utils'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRole } from 'enums'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      password,
      fullName,
      phoneNumber,
      avatarUrl,
      isActive,
      role,
      code,
      facebookId,
      googleId
    } = createUserDto

    // find user by email, code or phone number to prevent duplicate
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { code }, { phoneNumber }]
      }
    })

    if (existingUser) {
      throw new BadRequestException('User with the same email, code or phone number already exists')
    }

    const hashedPassword = await this.hashPassword(password)
    const userCode = code || generateUserCode()

    return this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        facebookId,
        googleId,
        fullName,
        phoneNumber,
        avatarUrl,
        isActive,
        role: role,
        code: userCode
      }
    })
  }

  async findAll() {
    const users = await this.prismaService.user.findMany()
    return new OffsetPaginatedResponseDto({
      items: users,
      limit: users.length,
      page: 1,
      total: users.length
    })
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

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email }
    })

    return foundUser
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw new EntityNotFoundException('User', id)
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto
    })
  }

  async remove(id: string): Promise<void> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw new EntityNotFoundException('User', id)
    }

    await this.prismaService.user.delete({
      where: { id }
    })
  }

  private async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds)
  }

  async findByFacebookId(facebookId: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { facebookId }
    })
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { googleId }
    })
  }
}
