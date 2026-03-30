import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { PrismaService } from 'database/prisma/prisma.service'
import { FindAllAttributeDto } from 'domains/attributes/dto/find-all-attribute.dto'
import { OffsetPaginatedResponseDto } from 'core'
import { Attribute } from 'domains/attributes/entities/attribute.entity'
import { Prisma } from '@prisma/client'
import { slugifyString } from 'utils/business.util'

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
        name: createAttributeDto.name,
        slug: createAttributeDto.slug || slugifyString(createAttributeDto.name),
        isGlobalFilter: createAttributeDto.isGlobalFilter ?? false,
        values: {
          create: createAttributeDto.values.map((value) => ({ value }))
        }
      },
      include: {
        values: true
      }
    })
  }

  async findAll(query: FindAllAttributeDto): Promise<OffsetPaginatedResponseDto<Attribute>> {
    const page = query.page || 1
    const limit = query.getAll ? undefined : query.limit || 10
    const skip = query.getAll ? undefined : (page - 1) * limit

    const { categoryId, isGlobalFilter } = query
    const whereClause: Prisma.AttributeWhereInput = {}

    if (categoryId) {
      whereClause.categoryAttributes = {
        some: {
          categoryId
        }
      }
    }

    if (isGlobalFilter !== undefined) {
      whereClause.isGlobalFilter = isGlobalFilter
    }

    const [attributes, total] = await Promise.all([
      this.prismaService.attribute.findMany({
        skip,
        where: whereClause,
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

  findOne(id: string) {
    return this.prismaService.attribute.findUnique({
      where: { id },
      include: {
        values: {
          select: {
            id: true,
            attributeId: true,
            value: true
          }
        }
      }
    })
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    // Check if attribute exists
    const existingAttribute = await this.prismaService.attribute.findUnique({
      where: { id },
      include: { values: true }
    })

    if (!existingAttribute) {
      throw new BadRequestException('Attribute not found')
    }

    // Check for unique constraint violations if name or slug is being updated
    if (updateAttributeDto.name || updateAttributeDto.slug) {
      const conflictingAttribute = await this.prismaService.attribute.findFirst({
        where: {
          AND: [
            { id: { not: id } }, // Exclude current attribute
            {
              OR: [
                updateAttributeDto.name ? { name: updateAttributeDto.name } : {},
                updateAttributeDto.slug
                  ? {
                      slug:
                        updateAttributeDto.slug ||
                        slugifyString(updateAttributeDto.name || existingAttribute.name)
                    }
                  : {}
              ].filter((obj) => Object.keys(obj).length > 0)
            }
          ]
        }
      })

      if (conflictingAttribute) {
        throw new BadRequestException('An attribute with the same name or slug already exists')
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (updateAttributeDto.name !== undefined) {
      updateData.name = updateAttributeDto.name
    }

    if (updateAttributeDto.slug !== undefined) {
      updateData.slug =
        updateAttributeDto.slug || slugifyString(updateAttributeDto.name || existingAttribute.name)
    }

    if (updateAttributeDto.isGlobalFilter !== undefined) {
      updateData.isGlobalFilter = updateAttributeDto.isGlobalFilter
    }

    // Handle values update if provided
    if (updateAttributeDto.values !== undefined) {
      // Delete existing values
      await this.prismaService.attributeValue.deleteMany({
        where: { attributeId: id }
      })

      // Create new values
      updateData.values = {
        create: updateAttributeDto.values.map((value) => ({ value }))
      }
    }

    return this.prismaService.attribute.update({
      where: { id },
      data: updateData,
      include: {
        values: {
          select: {
            id: true,
            attributeId: true,
            value: true
          }
        }
      }
    })
  }

  async softDelete(id: string): Promise<Attribute> {
    const existingAttribute = await this.prismaService.attribute.findUnique({
      where: { id }
    })

    if (!existingAttribute) {
      throw new BadRequestException('Attribute not found')
    }

    if (!existingAttribute.isDeleted) {
      throw new BadRequestException('Attribute is not marked as deleted')
    }

    return this.prismaService.attribute.update({
      where: { id },
      data: { isDeleted: false, deletedAt: new Date() }
    })
  }

  remove(id: string) {
    return this.prismaService.attribute.delete({
      where: { id }
    })
  }
}
