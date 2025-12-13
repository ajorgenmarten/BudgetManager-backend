import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import UserEntity from 'src/common/entities/user.entity';
import AuthRepository from '../repositories/auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    super({ session: false, usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified)
      throw new UnauthorizedException('Email not verified');

    return user;
  }
}
