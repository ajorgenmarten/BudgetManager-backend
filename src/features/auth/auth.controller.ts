import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import LocalAuthGuard from './guards/local-auth.guard';
import type { Request, Response } from 'express';
import AuthService from './services/auth.service';
import UserEntity from 'src/common/entities/user.entity';
import envs from 'src/common/configs/envs';
import JwtAuthGuard from './guards/jwt-auth.guard';
import SessionEntity from 'src/common/entities/session.entity';
import JwtAccessGuard from './guards/jwt-access.guard';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import LoginDto from './dtos/login.dto';
import RegisterDto from './dtos/register.dto';
import JwtVerifyEmailGuard from './guards/jwt-verify-email.guard';

@ApiTags('Autenticación')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.login(req.user as UserEntity);
    return res
      .cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: envs.COOKIE_SECURE,
        sameSite: 'none',
      })
      .json({
        accessToken: response.accessToken,
        me: (req.user as UserEntity).toDomain(),
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(
      req.user as UserEntity,
      req.session as SessionEntity,
    );
  }

  @UseGuards(JwtAccessGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  @ApiQuery({ name: 'token', type: String, required: true })
  @UseGuards(JwtVerifyEmailGuard)
  @Get('verify-email')
  async verifyEmail(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.verifyEmail(
      req.user as UserEntity,
    );
    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: envs.COOKIE_SECURE,
        sameSite: 'none',
      })
      .json({ accessToken, me: (req.user as UserEntity).toDomain() });
  }

  @Post('register')
  register(@Body() body: RegisterDto, @Headers('referer') referer?: string) {
    return this.authService.register(body, referer);
  }

  @ApiOperation({
    description:
      '⚠️ Mucha atención, este endpoint no debe estar en producción, esto es solo con fines de pruebas locales sin internet para el envio de emails',
    deprecated: true,
  })
  @Post('test-register')
  testRegister(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('forgot-password')
  async forgotPassword() {}

  @Post('reset-password')
  async resetPassword() {}
}
