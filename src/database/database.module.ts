import { Global, Module } from '@nestjs/common'
import { PrismaModule } from 'database/prisma/prisma.module'
import { RedisModule } from 'database/redis/redis.module'

@Global()
@Module({
  imports: [PrismaModule, RedisModule],
  exports: [PrismaModule, RedisModule]
})
export class DatabaseModule {}
