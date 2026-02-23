import { PartialType } from '@nestjs/swagger';
import { CreateCountryOfOriginDto } from './create-country-of-origin.dto';

export class UpdateCountryOfOriginDto extends PartialType(CreateCountryOfOriginDto) {}
