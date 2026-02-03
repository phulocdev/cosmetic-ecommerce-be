// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL')
    })
    super({ adapter, log: ['query', 'info', 'warn', 'error'] })
  }

  async onModuleInit() {
    await this.$connect().catch((error) => {
      console.error('Prisma connection error:', error)
    })
  }
}
