"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const winston = __importStar(require("winston"));
const { combine, timestamp, printf, colorize, errors, json } = winston.format;
const devFormat = printf(({ level, message, timestamp, context, trace, ...meta }) => {
    const contextStr = context ? `[${context}]` : '';
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    const traceStr = trace ? `\n${trace}` : '';
    return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}${traceStr}`;
});
const prodFormat = combine(timestamp(), errors({ stack: true }), json());
const developmentFormat = combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), devFormat);
exports.winstonConfig = {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.NODE_ENV === 'production' ? prodFormat : developmentFormat,
    defaultMeta: {
        service: process.env.APP_NAME || 'PL.inc'
    },
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error']
        }),
        ...(process.env.NODE_ENV === 'production'
            ? [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 10485760,
                    maxFiles: 5,
                    tailable: true
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 10485760,
                    maxFiles: 10,
                    tailable: true
                })
            ]
            : [])
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        ...(process.env.NODE_ENV === 'production'
            ? [new winston.transports.File({ filename: 'logs/exceptions.log' })]
            : [])
    ],
    rejectionHandlers: [
        new winston.transports.Console(),
        ...(process.env.NODE_ENV === 'production'
            ? [new winston.transports.File({ filename: 'logs/rejections.log' })]
            : [])
    ]
};
//# sourceMappingURL=winston.config.js.map