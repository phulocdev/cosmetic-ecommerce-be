import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseUUIDPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
