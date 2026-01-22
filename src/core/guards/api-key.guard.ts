import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BadRequestError } from 'core/exceptions/errors.exception'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.headers['x-api-key']

    if (!apiKey) {
      throw new BadRequestError('Không nhận được API_KEY')
    }

    if (apiKey !== this.configService.get<string>('API_KEY')) {
      throw new UnauthorizedException('INVALID_API_KEY')
    }

    return true
  }
}
