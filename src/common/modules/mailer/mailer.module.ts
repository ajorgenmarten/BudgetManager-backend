import { Global, Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import envs from 'src/common/configs/envs';
import MailerService from './mailer.service';
import TemplateService from './template.service';

@Global()
@Module({
  providers: [
    {
      provide: 'MAILER',
      useFactory: () => {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: envs.MAILER_USER,
            pass: envs.MAILER_PASSWORD,
          },
        });
      },
    },
    TemplateService,
    MailerService,
  ],
  exports: [MailerService],
})
export default class MailerModule {}
