import { Type } from '@nestjs/common';
export declare const SKIP_TRANSFORM_KEY = "skipTransform";
export declare const SkipTransform: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RESPONSE_MESSAGE_KEY = "responseMessage";
export declare const ResponseMessage: (message: string) => import("@nestjs/common").CustomDecorator<string>;
export declare function ApiEndpoint(options: {
    summary: string;
    description?: string;
    deprecated?: boolean;
}): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiOffsetPaginatedResponse<TModel extends Type<any>>(model: TModel): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiCursorPaginatedResponse<TModel extends Type<any>>(model: TModel): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiProtected(): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
