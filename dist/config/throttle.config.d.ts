declare const _default: (() => {
    ttl: number;
    limit: number;
    auth: {
        ttl: number;
        limit: number;
    };
    login: {
        ttl: number;
        limit: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    ttl: number;
    limit: number;
    auth: {
        ttl: number;
        limit: number;
    };
    login: {
        ttl: number;
        limit: number;
    };
}>;
export default _default;
