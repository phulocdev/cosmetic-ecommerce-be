import { ConfigService } from '@nestjs/config';
import { UsersService } from 'domains/users/users.service';
import Redis from 'ioredis';
import { Strategy } from 'passport-jwt';
import { AccessTokenPayload } from 'types';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    private redis;
    constructor(configService: ConfigService, usersService: UsersService, redis: Redis);
    validate(payload: AccessTokenPayload): Promise<AccessTokenPayload>;
}
export {};
