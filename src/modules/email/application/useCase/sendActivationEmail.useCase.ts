import { type IEmailGateway } from '../../domain/gateway/IEmail.gateway';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Usuario from '../../../usuario/domain/entities/Usuario';

type Response = Either<AppError.UnexpectedError, Result<string>>;
interface EmailInput {
  email: string;
  link: string;
  usuario: Usuario;
}

export class SendActivationEmailUseCase
  implements IUseCase<EmailInput, Promise<Response>>
{
  constructor(private readonly emailGateway: IEmailGateway) {}

  async execute(input: EmailInput): Promise<Response> {
    try {
      await this.emailGateway.send(
        input.email,
        'Realize a ativação da sua conta',
        {
          nome: input.usuario.nome,
          link: input.link,
        },
        './template/sendActivation.handlebars',
      );

      return right(
        Result.ok<string>(
          'Email de ativação enviado com sucesso! Verifique sua caixa de entrada.',
        ),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
