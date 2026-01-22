import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { PaginationQueryDto } from 'core/dto-validators/pagination-query.dto'
import { CreateUserDto } from 'domains/users/dto/create-user.dto'
import { UsersService } from 'domains/users/users.service'
import { UserQueryDto } from 'domains/users/dto/user-query.dto'
import { UpdateUserDto } from 'domains/users/dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Post()
  @ResponseMessage('Tạo tài khoản thành công')
  create(@Body() createUserDto: CreateUserDto) {
    return this.UsersService.create(createUserDto)
  }

  @Get()
  @ResponseMessage('Lấy danh sách tài khoản thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query() tableQuery: UserQueryDto) {
    return this.UsersService.findAll({ ...paginationQuery, ...tableQuery })
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tài khoản thành công')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.UsersService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tài khoản thành công')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.UsersService.update(id, updateUserDto)
  }

  @Delete(':id')
  @ResponseMessage('Xóa tài khoản thành công')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.UsersService.remove(id)
  }
}
