import { type IEmailGateway } from '../../../../modules/email/domain/gateway/IEmail.gateway';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';

type Response = Either<AppError.UnexpectedError, Result<string>>;

export class SendResetPasswordEmailUseCase
  implements
    IUseCase<
      {
        email: string;
        nome: string;
      },
      Promise<Response>
    >
{
  constructor(private readonly emailGateway: IEmailGateway) {}

  async execute(usuario: { email: string; nome: string }): Promise<Response> {
    try {
      await this.emailGateway.send(
        usuario.email,
        'Senha redefinida com sucesso',
        {
          nome: usuario.nome,
        },
        './template/resetPassword.handlebars',
      );

      return right(
        Result.ok<string>(
          'Caso um usuário com esse e-mail exista, um e-mail foi enviado com as instruções sobre a redefinição de senha.',
        ),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
