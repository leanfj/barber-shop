import { createTransport, type SendMailOptions } from 'nodemailer';

import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import path from 'path';
import { AppError } from '../../../../core/application/AppError';
import {
  type Either,
  Result,
  right,
  left,
} from '../../../../core/logic/Result';
import { type IEmailGateway } from '../../domain/gateway/IEmail.gateway';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class MailHogEmailGateway implements IEmailGateway {
  constructor() {}

  async send(
    email: string,
    subject: string,
    payload: { nome: string; link?: string },
    template: string,
  ): Promise<Response> {
    try {
      const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: 1025,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const source = readFileSync(path.join(__dirname, template), 'utf8');
      const compiledTemplate = compile(source);
      const options = (): SendMailOptions => {
        return {
          from: process.env.FROM_EMAIL,
          to: email,
          subject,
          html: compiledTemplate(payload),
        };
      };

      await transporter.sendMail(options());

      return right(Result.ok<string>('E-mail enviado'));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
