"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const redis_module_1 = require("../../../database/redis/redis.module");
const users_service_1 = require("../../users/users.service");
const ioredis_1 = __importDefault(require("ioredis"));
const passport_jwt_1 = require("passport-jwt");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    configService;
    usersService;
    redis;
    constructor(configService, usersService, redis) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_SECRET')
        });
        this.configService = configService;
        this.usersService = usersService;
        this.redis = redis;
    }
    async validate(payload) {
        const [isBlacklisted, currentTokenVersion] = await Promise.all([
            this.redis.get(`blacklist:access:${payload.jti}`),
            this.redis.get(`user:${payload.userId}:access_token_version`)
        ]);
        if ((currentTokenVersion && parseInt(currentTokenVersion) > payload.version) || isBlacklisted) {
            throw new common_1.UnauthorizedException('Access token has been invalidated');
        }
        const user = await this.usersService.findOne(payload.userId);
        if (!user || !user.isActive) {
            throw new common_1.BadRequestException('User not found or inactive');
        }
        return payload;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        ioredis_1.default])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map