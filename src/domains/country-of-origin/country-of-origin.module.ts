import { Module } from '@nestjs/common';
import { CountryOfOriginService } from './country-of-origin.service';
import { CountryOfOriginController } from './country-of-origin.controller';

@Module({
  controllers: [CountryOfOriginController],
  providers: [CountryOfOriginService],
})
export class CountryOfOriginModule {}
