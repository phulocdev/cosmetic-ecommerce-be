import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { PrismaService } from 'database/prisma/prisma.service'
import { slugifyString } from 'utils'
import { FindAllAttributeDto } from 'domains/attributes/dto/find-all-attribute.dto'
import { OffsetPaginatedResponseDto } from 'core'
import { Attribute } from 'domains/attributes/entities/attribute.entity'

@Injectable()
export class AttributesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAttributeDto: CreateAttributeDto) {
    // Check the unique constraint for name and slug
    const existingAttribute = await this.prismaService.attribute.findFirst({
      where: {
        OR: [
          { name: createAttributeDto.name },
          { slug: createAttributeDto.slug || slugifyString(createAttributeDto.name) }
        ]
      }
    })

    if (existingAttribute) {
      throw new BadRequestException('An attribute with the same name or slug already exists')
    }

    return this.prismaService.attribute.create({
      data: {
        ...createAttributeDto,
        slug: createAttributeDto.slug || slugifyString(createAttributeDto.name)
      }
    })
  }

  async findAll(query: FindAllAttributeDto): Promise<OffsetPaginatedResponseDto<Attribute>> {
    const page = query.page || 1
    const limit = query.getAll ? undefined : query.limit || 10
    const skip = query.getAll ? undefined : (page - 1) * limit

    const [attributes, total] = await Promise.all([
      this.prismaService.attribute.findMany({
        skip,
        take: limit,
        include: {
          values: {
            select: {
              id: true,
              attributeId: true,
              value: true
            }
          }
        }
      }),
      this.prismaService.attribute.count()
    ])

    return new OffsetPaginatedResponseDto({
      items: attributes,
      limit,
      page,
      total
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} attribute`
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return `This action updates a #${id} attribute`
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`
  }
}
