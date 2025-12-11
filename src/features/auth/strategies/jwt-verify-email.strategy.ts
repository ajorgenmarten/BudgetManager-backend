import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import AuthRepository from '../repositories/auth.repository';
import envs from 'src/common/configs/envs';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export default class JwtVerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify-email',
) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: envs.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { uid: string }) {
    const user = await this.authRepository.findUserById(payload.uid);

    if (!user) throw new UnauthorizedException('Invalid user');

    return user;
  }
}
