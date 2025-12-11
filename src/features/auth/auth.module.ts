import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import LocalStrategy from './strategies/local.strategy';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import JwtAuthStrategy from './strategies/jwt-auth.strategy';
import AuthService from './services/auth.service';
import AuthRepository from './repositories/auth.repository';
import JwtVerifyEmailStrategy from './strategies/jwt-verify-email.strategy';

@Module({
  providers: [
    LocalStrategy,
    JwtAccessStrategy,
    JwtAuthStrategy,
    JwtVerifyEmailStrategy,
    AuthService,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [JwtAccessStrategy],
})
export default class AuthModule {}
