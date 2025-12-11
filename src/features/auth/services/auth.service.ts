import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import SessionEntity from 'src/common/entities/session.entity';
import UserEntity from 'src/common/entities/user.entity';
import envs from 'src/common/configs/envs';
import RegisterDto from '../dtos/register.dto';
import AuthRepository from '../repositories/auth.repository';
import MailerService from 'src/common/modules/mailer/mailer.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly mailerService: MailerService,
  ) {}

  async login(user: UserEntity) {
    const session = SessionEntity.new(user);
    await this.authRepository.createSession(session);
    const refreshToken = this.jwtService.sign({ sid: session.id });
    const accessToken = this.jwtService.sign(
      { date: new Date().toISOString(), uid: user.id },
      {
        secret: session.secret,
        expiresIn: envs.JWT_EXPIRES_IN as JwtSignOptions['expiresIn'],
      },
    );
    return { accessToken, refreshToken };
  }

  refreshToken(user: UserEntity, session: SessionEntity) {
    const accessToken = this.jwtService.sign(
      { date: new Date().toISOString(), uid: user.id },
      {
        secret: session.secret,
        expiresIn: envs.JWT_EXPIRES_IN as JwtSignOptions['expiresIn'],
      },
    );
    return { accessToken };
  }

  async register(registerDto: RegisterDto, referer: string = 'localhost') {
    const existUser = await this.authRepository.findUserByEmail(
      registerDto.email,
    );
    if (existUser)
      throw new BadRequestException('Already a user with this email');

    const user = UserEntity.new(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );

    await this.authRepository.registerUser(user);

    const token = this.jwtService.sign({ uid: user.id });

    await this.mailerService.sendRegistrationEmail({
      email: user.email,
      name: user.name,
      link: new URL(referer).origin + '/verifyEmail?token=' + token,
    });

    return {
      message:
        'Ha sido enviado un correo para la activación y verificación de su cuenta',
    };
  }

  async verifyEmail(user: UserEntity) {
    user.emailVerified = true;

    await this.authRepository.updateUser(user);

    const loginResponse = await this.login(user);

    return loginResponse;
  }

  async registerUserForTest(registerDto: RegisterDto) {
    const existUser = await this.authRepository.findUserByEmail(
      registerDto.email,
    );
    if (existUser)
      throw new BadRequestException('Already a user with this email');

    const user = UserEntity.new(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );

    user.emailVerified = true;

    await this.authRepository.registerUser(user);

    return await this.login(user);
  }
}
