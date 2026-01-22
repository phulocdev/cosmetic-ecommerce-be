import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { PaginationQueryDto } from 'core/dto-validators/pagination-query.dto'
import { BadRequestError, NotFoundError } from 'core/exceptions/errors.exception'
import { CreateUserDto } from 'domains/users/dto/create-user.dto'
import { UpdateUserDto } from 'domains/users/dto/update-user.dto'
import { UserQueryDto } from 'domains/users/dto/user-query.dto'
import { RefreshToken } from 'domains/users/schemas/refresh-token.schema'
import { User } from 'domains/users/schemas/user.schema'
import { FilterQuery, Model } from 'mongoose'

@Injectable()
export class UsersService {
  private saltRounds = 10
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>
  ) {}

  async create(createUserDto: CreateUserDto & { _id?: string }): Promise<UserType> {
    const [existingUser, hashedPassword] = await Promise.all([
      this.userModel.findOne({ email: createUserDto.email }),
      this.hashPassword(createUserDto.password)
    ])

    if (existingUser) {
      throw new BadRequestError('Email này đã tồn tại trên hệ thống')
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      _id: createUserDto._id
    })

    return {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      isEmailVerified: newUser.isEmailVerified
    }
  }

  async findAll(qs: PaginationQueryDto & UserQueryDto) {
    const { page, limit, sort: sortQuery, email, fullName, isActive, role } = qs

    const filter: FilterQuery<User> = {}

    if (email) {
      filter.email = email
    }

    if (fullName) {
      filter.fullName = { $regex: fullName, $options: 'i' }
    }

    if (isActive) {
      filter.isActive = true
    } else if (isActive === 0) {
      filter.isActive = false
    }

    if (role) {
      filter.role = role
    }

    // sort: createdAt.desc || createdAt.asc
    let sort: Record<string, 1 | -1> = { createdAt: -1 }
    if (sortQuery) {
      const sortField = sortQuery.split('.')[0]
      const isDescending = sortQuery.split('.')[1] === 'desc'
      sort = isDescending ? { [sortField]: -1 } : { [sortField]: 1 }
    }

    const query = this.userModel.find(filter).sort(sort)

    if (limit && page) {
      query.skip((page - 1) * limit).limit(limit)
    }

    const [data, totalDocuments] = await Promise.all([query, this.userModel.countDocuments(filter)])

    return {
      data,
      meta: {
        page: page || 1,
        limit: limit || totalDocuments,
        totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
        totalDocuments
      }
    }
  }

  async findOne(id: string) {
    const User = await this.userModel.findOne({ _id: id })
    if (!User) {
      throw new NotFoundError('Tài khoản không tồn tại')
    }

    return this.userModel.findById(id)
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email })
  }

  findByRefreshToken(refreshToken: string) {
    return this.userModel.findOne({ refreshToken })
  }

  async findUserByEmailAndPassword({ email, password }: { email: string; password: string }) {
    const user = await this.findByEmail(email)
    if (!user) return null

    const isMatchPassword = await this.comparePassword(password, user.password)
    return isMatchPassword ? user : null
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { isChangeEmail, isChangePhoneNumber, email, phoneNumber } = updateUserDto
    const User = await this.userModel.findOne({ _id: id })

    if (isChangePhoneNumber) {
      const isExistUserWithPhoneNumber = (await this.userModel.findOne({ phoneNumber })) !== null
      if (isExistUserWithPhoneNumber) {
        throw new BadRequestError('Số điện thoại này đã tồn tại')
      }
    }

    if (isChangeEmail) {
      const isExistUserWithEmail = (await this.userModel.findOne({ email })) !== null
      if (isExistUserWithEmail) {
        throw new BadRequestError('Email này đã tồn tại')
      }
    }

    if (!User) {
      throw new NotFoundError('Tài khoản không tồn tại')
    }
    return this.userModel.updateOne({ _id: id }, { ...updateUserDto })
  }

  async findOneAndUpdateByEmail(email: string, updateUserDto: UpdateUserDto) {
    // const hashedPassword = await this.hashPassword(updateUserDto.password)
    // const updatedUser = await this.userModel.findOneAndUpdate(
    //   { email },
    //   { ...updateUserDto, password: hashedPassword },
    //   { $new: true }
    // )
    // return {
    //   _id: updatedUser._id,
    //   avatarUrl: updatedUser.avatarUrl,
    //   email: updatedUser.email,
    //   fullName: updatedUser.fullName,
    //   role: updatedUser.role,
    //   phoneNumber: updatedUser.phoneNumber
    // }
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await this.hashPassword(password)
    return this.userModel.updateOne(
      { _id: id },
      {
        password: hashedPassword
      }
    )
  }

  async updatePasswordByEmail(email: string, password: string) {
    const hashedPassword = await this.hashPassword(password)
    return this.userModel.updateOne(
      { email },
      {
        password: hashedPassword
      }
    )
  }

  async remove(id: string) {
    const User = await this.userModel.findOne({ _id: id })
    if (!User) {
      throw new NotFoundError('Tài khoản không tồn tại')
    }
    return this.userModel.deleteOne({ _id: id })
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds)
  }

  comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }

  createRefreshToken(payload: CreateRefreshTokenPayload) {
    return this.refreshTokenModel.create(payload)
  }
}
