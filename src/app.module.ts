import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import envs from './common/configs/envs';
import { AppController } from './app.controller';
import PrismaModule from './common/modules/prisma/prisma.module';
import AuthModule from './features/auth/auth.module';
import TodoModule from './features/todo/todo.module';
import MailerModule from './common/modules/mailer/mailer.module';

@Module({
  imports: [
    PrismaModule,
    MailerModule,
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
    }),
    AuthModule,
    TodoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
