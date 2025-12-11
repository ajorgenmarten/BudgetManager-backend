import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import envs from 'src/common/configs/envs';
import AuthRepository from '../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { cookieExtractor } from '../utilities/jwt.extractor';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sid: string }) {
    const session = await this.authRepository.findSessionById(payload.sid);

    if (!session) throw new UnauthorizedException('Invalid session');

    const jwtAccessSecret = session.secret;

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!accessToken) throw new UnauthorizedException('Invalid access token');

    try {
      const payload = await this.jwtService.verifyAsync<{
        date: string;
        uid: string;
      }>(accessToken, {
        secret: jwtAccessSecret,
      });

      if (session.userId !== payload.uid)
        throw new UnauthorizedException('Invalid user');

      const user = await this.authRepository.findUserById(payload.uid);

      if (!user) throw new UnauthorizedException('Invalid user');

      req.session = session;

      return user;
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }
  }
}
