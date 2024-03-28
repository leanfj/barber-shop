// import type IUsuarioRepository from '../../../modules/usuario/domain/repositories/IUsuarioRepository';
import { type GetUsuarioByEmailInput } from '../../../modules/usuario/application/useCase/GetUsuarioByEmail';
import { AppError } from '../../../core/application/AppError';
import { type Either, left, Result, right } from '../../../core/logic/Result';
import { type LoginInput, LoginUseCase } from './useCase/login.useCase';
import { type UsuarioService } from '../../../modules/usuario/application/Usuario.service';
import { LoginErrors } from './useCase/loginErrors';
// import { RequestResetPasswordUseCase } from './useCase/requestResetPassword.useCase';
// import { ResetPasswordUseCase } from './useCase/resetPassword.useCase';

type Response = Either<
  AppError.UnexpectedError,
  Result<{ token: string } | string>
>;

export class LoginService {
  private readonly usuarioService: UsuarioService;
  private readonly loginUseCase: LoginUseCase;
  // private readonly requestResetPasswordUseCase: RequestResetPasswordUseCase;
  // private readonly resetPasswordUseCase: ResetPasswordUseCase;
  // private readonly sendRequestResetPasswordEmailUseCase: SendRequestResetPasswordEmailUseCase;
  // private readonly sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase;

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
    this.loginUseCase = new LoginUseCase();
    // readonly tokenRepository: ITokenRepository, // readonly usuarioRepository: IUsuarioRepository,
    // readonly emailServiceRepository: IEmailServiceRepository,
    // this.resetPasswordUseCase = new ResetPasswordUseCase(
    //   usuarioRepository,
    //   tokenRepository,
    // );
    // this.requestResetPasswordUseCase = new RequestResetPasswordUseCase(
    //   usuarioRepository,
    //   tokenRepository,
    // );
    // this.sendRequestResetPasswordEmailUseCase =
    //   new SendRequestResetPasswordEmailUseCase(
    //     emailServiceRepository,
    //     usuarioRepository,
    //   );
    // this.sendResetPasswordEmailUseCase = new SendResetPasswordEmailUseCase(
    //   emailServiceRepository,
    //   usuarioRepository,
    // );
  }

  public async login(login: LoginInput): Promise<Response> {
    try {
      const getUsuarioByEmailInput: GetUsuarioByEmailInput = {
        email: login.email,
      };

      const usuario = await this.usuarioService.getByEmail(
        getUsuarioByEmailInput,
      );

      if (usuario.isLeft()) {
        return left(new LoginErrors.PasswordOrEmailIncorrect());
      }

      const result = await this.loginUseCase.execute({
        login,
        usuario: usuario.value.getValue(),
      });

      if (result.isLeft()) {
        return left(result.value);
      } else {
        return right(Result.ok<{ token: string }>(result.value.getValue()));
      }
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  // public async requestResetPassword(email: string): Promise<Response> {
  //   try {
  //     const linkOrError = await this.requestResetPasswordUseCase.execute(email);

  //     if (linkOrError.isLeft()) {
  //       return left(linkOrError.value);
  //     }

  //     const link = linkOrError.value.getValue();

  //     const sendEmailOrError =
  //       await this.sendRequestResetPasswordEmailUseCase.execute({
  //         email,
  //         link,
  //       });

  //     if (sendEmailOrError.isLeft()) {
  //       return left(sendEmailOrError.value);
  //     }

  //     return right(Result.ok<string>('E-mail sended'));
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }

  // public async resetPassword(
  //   usuarioId: string,
  //   token: string,
  //   password: string,
  // ): Promise<Response> {
  //   try {
  //     const resetOrError = await this.resetPasswordUseCase.execute({
  //       usuarioId,
  //       token,
  //       password,
  //     });

  //     if (resetOrError.isLeft()) {
  //       return left(resetOrError.value);
  //     }

  //     const sendEmailOrError =
  //       await this.sendResetPasswordEmailUseCase.execute(usuarioId);

  //     if (sendEmailOrError.isLeft()) {
  //       return left(sendEmailOrError.value);
  //     }

  //     return right(Result.ok<string>('E-mail sended'));
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }
}
