import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtVerifyEmailGuard extends AuthGuard(
  'jwt-verify-email',
) {}
