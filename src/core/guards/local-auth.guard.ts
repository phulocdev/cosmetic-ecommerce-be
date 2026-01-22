import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalEmployeeAuthGuard extends AuthGuard('local') {}
