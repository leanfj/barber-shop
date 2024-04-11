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
import { type IEmailGateway } from '../../../../modules/email/domain/gateway/IEmail.gateway';
import { EnvConstants } from '../../../../env/envContants';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GmailEmailGateway implements IEmailGateway {
  constructor() {}

  async send(
    email: string,
    subject: string,
    payload: { nome: string; link?: string },
    template: string,
  ): Promise<Response> {
    try {
      const transporter = createTransport({
        host: EnvConstants.EMAIL_HOST,
        port: 465,
        auth: {
          user: EnvConstants.EMAIL_USERNAME,
          pass: EnvConstants.EMAIL_PASSWORD,
        },
      });

      const source = readFileSync(path.join(__dirname, template), 'utf8');
      const compiledTemplate = compile(source);
      const options = (): SendMailOptions => {
        return {
          from: EnvConstants.FROM_EMAIL,
          to: email,
          subject,
          html: compiledTemplate(payload),
        };
      };

      await transporter.sendMail(options());

      return right(Result.ok<string>('E-mail sended'));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
