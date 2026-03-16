declare const _default: (() => {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    type: string;
    poolMin: number;
    poolMax: number;
    logging: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    type: string;
    poolMin: number;
    poolMax: number;
    logging: boolean;
}>;
export default _default;
