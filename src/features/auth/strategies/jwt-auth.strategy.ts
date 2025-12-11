import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import envs from 'src/common/configs/envs';
import { cookieExtractor } from '../utilities/jwt.extractor';
import AuthRepository from '../repositories/auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export default class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-auth',
) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sid: string }) {
    const session = await this.authRepository.findSessionById(payload.sid);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const user = await this.authRepository.findUserById(session.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    req.session = session;

    return user;
  }
}
