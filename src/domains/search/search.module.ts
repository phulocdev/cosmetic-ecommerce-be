// search.module.ts
import { Module } from '@nestjs/common'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD')
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService]
})
export class SearchModule {}
