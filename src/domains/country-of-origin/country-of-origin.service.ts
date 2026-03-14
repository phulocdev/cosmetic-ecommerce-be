import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { OffsetPaginatedResponseDto } from 'core'
import { CountryOfOrigin } from 'domains/country-of-origin/entities/country-of-origin.entity'
import { CreateCountryOfOriginDto } from './dto/create-country-of-origin.dto'
import { UpdateCountryOfOriginDto } from './dto/update-country-of-origin.dto'
import { FindAllCountryOfOriginDto } from './dto/find-all-country-of-origin.dto'

@Injectable()
export class CountryOfOriginService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCountryOfOriginDto: CreateCountryOfOriginDto): Promise<CountryOfOrigin> {
    const existing = await this.prismaService.countryOfOrigin.findFirst({
      where: { name: createCountryOfOriginDto.name }
    })

    if (existing) {
      throw new BadRequestException('A country of origin with the same name already exists')
    }

    return this.prismaService.countryOfOrigin.create({
      data: { name: createCountryOfOriginDto.name }
    })
  }

  async findAll(
    query: FindAllCountryOfOriginDto
  ): Promise<OffsetPaginatedResponseDto<CountryOfOrigin>> {
    const page = query.page || 1
    const limit = query.getAll ? undefined : query.limit || 10
    const skip = query.getAll ? undefined : (page - 1) * limit

    const [countries, total] = await Promise.all([
      this.prismaService.countryOfOrigin.findMany({ skip, take: limit }),
      this.prismaService.countryOfOrigin.count()
    ])

    return new OffsetPaginatedResponseDto({ items: countries, limit, page, total })
  }

  async findOne(id: string): Promise<CountryOfOrigin> {
    const country = await this.prismaService.countryOfOrigin.findUnique({ where: { id } })

    if (!country) throw new BadRequestException('Country of origin not found')

    return country
  }

  async update(
    id: string,
    updateCountryOfOriginDto: UpdateCountryOfOriginDto
  ): Promise<CountryOfOrigin> {
    const existing = await this.prismaService.countryOfOrigin.findUnique({ where: { id } })

    if (!existing) throw new BadRequestException('Country of origin not found')

    if (updateCountryOfOriginDto.name && updateCountryOfOriginDto.name !== existing.name) {
      const conflict = await this.prismaService.countryOfOrigin.findFirst({
        where: { name: updateCountryOfOriginDto.name, id: { not: id } }
      })
      if (conflict)
        throw new BadRequestException('A country of origin with the same name already exists')
    }

    return this.prismaService.countryOfOrigin.update({
      where: { id },
      data: {
        ...(updateCountryOfOriginDto.name !== undefined && { name: updateCountryOfOriginDto.name })
      }
    })
  }

  async softDelete(id: string): Promise<CountryOfOrigin> {
    const existing = await this.prismaService.countryOfOrigin.findUnique({ where: { id } })
    if (!existing) throw new BadRequestException('Country of origin not found')

    if (existing.isDeleted) {
      throw new BadRequestException('Country of origin is already deleted')
    }

    return this.prismaService.countryOfOrigin.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
      // data: { deletedAt: new Date() }
    })
  }

  async remove(id: string): Promise<CountryOfOrigin> {
    const existing = await this.prismaService.countryOfOrigin.findUnique({ where: { id } })

    if (!existing) throw new BadRequestException('Country of origin not found')

    return this.prismaService.countryOfOrigin.delete({ where: { id } })
  }
}
