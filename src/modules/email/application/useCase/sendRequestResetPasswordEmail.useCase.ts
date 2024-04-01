import { type IEmailGateway } from '../../../../modules/email/domain/gateway/IEmail.gateway';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Usuario from '../../../../modules/usuario/domain/entities/Usuario';

type Response = Either<AppError.UnexpectedError, Result<string>>;
interface EmailInput {
  email: string;
  link: string;
  usuario: Usuario;
}

export class SendRequestResetPasswordEmailUseCase
  implements IUseCase<EmailInput, Promise<Response>>
{
  constructor(private readonly emailGateway: IEmailGateway) {}

  async execute(input: EmailInput): Promise<Response> {
    try {
      await this.emailGateway.send(
        input.email,
        'Solicitação de redefinição de senha',
        {
          nome: input.usuario.nome,
          link: input.link,
        },
        './template/requestResetPassword.handlebars',
      );

      return right(
        Result.ok<string>(
          'Caso um usuário com esse e-mail exista, um e-mail foi enviado com as instruções para redefinir a senha.',
        ),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
