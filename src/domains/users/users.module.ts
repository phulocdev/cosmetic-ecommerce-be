import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenSchema } from 'domains/users/schemas/refresh-token.schema'
import { User, UserSchema } from 'domains/users/schemas/user.schema'
import { UsersController } from 'domains/users/users.controller'
import { UsersService } from 'domains/users/users.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
