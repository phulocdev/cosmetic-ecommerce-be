import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class TrimPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private trimObject;
}
