import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { OffsetPaginatedResponseDto } from 'core'
import { Brand } from 'domains/brands/entities/brand.entity'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { FindAllBrandDto } from './dto/find-all-brand.dto'

@Injectable()
export class BrandsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existing = await this.prismaService.brand.findFirst({
      where: { name: createBrandDto.name }
    })

    if (existing) {
      throw new BadRequestException('A brand with the same name already exists')
    }

    return this.prismaService.brand.create({
      data: {
        name: createBrandDto.name,
        imageUrl: createBrandDto.imageUrl ?? ''
      }
    })
  }

  async findAll(query: FindAllBrandDto): Promise<OffsetPaginatedResponseDto<Brand>> {
    const page = query.page || 1
    const limit = query.getAll ? undefined : query.limit || 10
    const skip = query.getAll ? undefined : (page - 1) * limit

    const [brands, total] = await Promise.all([
      this.prismaService.brand.findMany({ skip, take: limit }),
      this.prismaService.brand.count()
    ])

    return new OffsetPaginatedResponseDto({ items: brands, limit, page, total })
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.prismaService.brand.findUnique({ where: { id } })

    if (!brand) throw new BadRequestException('Brand not found')

    return brand
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const existing = await this.prismaService.brand.findUnique({ where: { id } })

    if (!existing) throw new BadRequestException('Brand not found')

    if (updateBrandDto.name && updateBrandDto.name !== existing.name) {
      const conflict = await this.prismaService.brand.findFirst({
        where: { name: updateBrandDto.name, id: { not: id } }
      })
      if (conflict) throw new BadRequestException('A brand with the same name already exists')
    }

    return this.prismaService.brand.update({
      where: { id },
      data: {
        name: updateBrandDto.name,
        imageUrl: updateBrandDto.imageUrl
      }
    })
  }

  async softDelete(id: string): Promise<Brand> {
    const existing = await this.prismaService.brand.findUnique({ where: { id } })
    if (!existing) {
      throw new BadRequestException('Brand not found')
    }

    if (existing.deletedAt) {
      throw new BadRequestException('Brand is already soft deleted')
    }

    return this.prismaService.brand.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
  }

  async remove(id: string): Promise<Brand> {
    const existing = await this.prismaService.brand.findUnique({ where: { id } })

    if (!existing) throw new BadRequestException('Brand not found')

    return this.prismaService.brand.delete({ where: { id } })
  }
}
