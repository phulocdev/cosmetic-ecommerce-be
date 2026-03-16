"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = exports.RESPONSE_MESSAGE_KEY = exports.SkipTransform = exports.SKIP_TRANSFORM_KEY = void 0;
exports.ApiEndpoint = ApiEndpoint;
exports.ApiOffsetPaginatedResponse = ApiOffsetPaginatedResponse;
exports.ApiCursorPaginatedResponse = ApiCursorPaginatedResponse;
exports.ApiProtected = ApiProtected;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../dto");
exports.SKIP_TRANSFORM_KEY = 'skipTransform';
const SkipTransform = () => (0, common_1.SetMetadata)(exports.SKIP_TRANSFORM_KEY, true);
exports.SkipTransform = SkipTransform;
exports.RESPONSE_MESSAGE_KEY = 'responseMessage';
const ResponseMessage = (message) => (0, common_1.SetMetadata)(exports.RESPONSE_MESSAGE_KEY, message);
exports.ResponseMessage = ResponseMessage;
function ApiEndpoint(options) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: options.summary,
        description: options.description,
        deprecated: options.deprecated
    }));
}
function ApiOffsetPaginatedResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(dto_1.OffsetPaginatedResponseDto, model), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved paginated list',
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(dto_1.OffsetPaginatedResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(model) }
                        }
                    }
                }
            ]
        }
    }));
}
function ApiCursorPaginatedResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(dto_1.OffsetPaginatedResponseDto, model), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved paginated list',
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(dto_1.OffsetPaginatedResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(model) }
                        }
                    }
                }
            ]
        }
    }));
}
function ApiProtected() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)('JWT-auth'));
}
//# sourceMappingURL=api-response.decorator.js.map