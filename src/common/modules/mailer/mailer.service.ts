import { Inject, Injectable, Logger } from '@nestjs/common';
import TemplateService from './template.service';
import * as nodemailer from 'nodemailer';
import envs from 'src/common/configs/envs';

type RegistrationPayload = {
  name: string;
  link: string;
  email: string;
};

@Injectable()
export default class MailerService {
  constructor(
    @Inject('MAILER') private readonly transporter: nodemailer.Transporter,
    private readonly templateService: TemplateService,
  ) {}

  async sendRegistrationEmail(data: RegistrationPayload) {
    try {
      await this.transporter.sendMail({
        to: data.email,
        from: `"Budget Manager" <${envs.MAILER_USER}>`,
        subject: 'Confirmar correo electrónico',
        html: await this.templateService.load('register', data),
      });
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
