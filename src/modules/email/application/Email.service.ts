import type Usuario from '../../../modules/usuario/domain/entities/Usuario';
import { AppError } from '../../../core/application/AppError';
import { type Either, Result, left, right } from '../../../core/logic/Result';
import { type IEmailGateway } from '../domain/gateway/IEmail.gateway';
import { SendRequestResetPasswordEmailUseCase } from './useCase/sendRequestResetPasswordEmail.useCase';
import { SendResetPasswordEmailUseCase } from './useCase/sendResetPasswordEmail.useCase';
import { SendActivationEmailUseCase } from './useCase/sendActivationEmail.useCase';

type Response = Either<AppError.UnexpectedError, Result<string>>;

export class EmailService {
  private readonly sendRequestResetPasswordEmailUseCase: SendRequestResetPasswordEmailUseCase;
  private readonly SendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase;
  private readonly sendActivationEmailUseCase: SendActivationEmailUseCase;

  constructor(emailGateway: IEmailGateway) {
    this.sendRequestResetPasswordEmailUseCase =
      new SendRequestResetPasswordEmailUseCase(emailGateway);
    this.SendResetPasswordEmailUseCase = new SendResetPasswordEmailUseCase(
      emailGateway,
    );
    this.sendActivationEmailUseCase = new SendActivationEmailUseCase(
      emailGateway,
    );
  }

  public async sendRequestResetPasswordEmail(input: {
    email: string;
    link: string;
    usuario: Usuario;
  }): Promise<Response> {
    try {
      const result =
        await this.sendRequestResetPasswordEmailUseCase.execute(input);

      if (result.isLeft()) {
        return left(result.value);
      }
      return right(Result.ok<string>(result.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  // public async sendWelcomeEmail(input: {
  //   email: string;
  //   usuario: Usuario;
  // }): Promise<Response> {
  //   try {
  //     await this.sendRequestResetPasswordEmailUseCase.execute({
  //       email: input.email,
  //       link: '',
  //       usuario: input.usuario,
  //     });

  //     return right(
  //       Result.ok<string>(
  //         'Caso um usuário com esse e-mail exista, um e-mail foi enviado com as instruções para resetar a senha.',
  //       ),
  //     );
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }

  public async sendPasswordChangedEmail(input: {
    email: string;
    usuario: Usuario;
  }): Promise<Response> {
    try {
      const result = await this.SendResetPasswordEmailUseCase.execute({
        email: input.email,
        nome: input.usuario.nome,
      });

      if (result.isLeft()) {
        return left(result.value);
      }
      return right(Result.ok<string>(result.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async sendActivationEmail(input: {
    email: string;
    usuario: Usuario;
    link: string;
  }): Promise<Response> {
    try {
      const result = await this.sendActivationEmailUseCase.execute({
        email: input.email,
        usuario: input.usuario,
        link: input.link,
      });

      if (result.isLeft()) {
        return left(result.value);
      }
      return right(Result.ok<string>(result.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
