declare const _default: (() => {
    nodeEnv: string;
    name: string;
    port: number;
    host: string;
    apiPrefix: string;
    apiVersion: string;
    url: string;
    maxFileSize: number;
    uploadDest: string;
    assetPrefix: string;
    bcryptSaltRounds: number;
    requestTimeoutMs: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    name: string;
    port: number;
    host: string;
    apiPrefix: string;
    apiVersion: string;
    url: string;
    maxFileSize: number;
    uploadDest: string;
    assetPrefix: string;
    bcryptSaltRounds: number;
    requestTimeoutMs: number;
}>;
export default _default;
