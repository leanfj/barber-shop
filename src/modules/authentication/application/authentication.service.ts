import { type GetUsuarioByEmailInput } from '../../usuario/application/useCase/GetUsuarioByEmail';
import { AppError } from '../../../core/application/AppError';
import { type Either, left, Result, right } from '../../../core/logic/Result';
import { type LoginInput, LoginUseCase } from './useCase/login.useCase';
import { type UsuarioService } from '../../usuario/application/Usuario.service';
import { LoginErrors } from './useCase/loginErrors';
import { RequestResetPasswordUseCase } from './useCase/requestResetPassword.useCase';
import type ITokenRepository from '../domain/repositories/ITokenRepository';
import { type EmailService } from '../../email/application/Email.service';
import { ResetPasswordUseCase } from './useCase/resetPassword.useCase';

type Response = Either<
  AppError.UnexpectedError,
  Result<
    | { token: string }
    | {
        link: string;
        usuarioId: string;
        resetPasswordToken: string;
      }
    | string
  >
>;

export class AuthenticationService {
  private readonly usuarioService: UsuarioService;
  private readonly emailService: EmailService;
  private readonly loginUseCase: LoginUseCase;
  private readonly requestResetPasswordUseCase: RequestResetPasswordUseCase;
  private readonly resetPasswordUseCase: ResetPasswordUseCase;

  constructor(
    usuarioService: UsuarioService,
    emailService: EmailService,
    tokenRepository: ITokenRepository,
  ) {
    this.usuarioService = usuarioService;
    this.emailService = emailService;
    this.loginUseCase = new LoginUseCase(tokenRepository);
    this.resetPasswordUseCase = new ResetPasswordUseCase(tokenRepository);
    this.requestResetPasswordUseCase = new RequestResetPasswordUseCase(
      tokenRepository,
    );
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

  public async requestResetPassword(email: string): Promise<Response> {
    try {
      const usuario = await this.usuarioService.getByEmail({ email });

      if (usuario.isLeft()) {
        return left(new LoginErrors.UserNotFound());
      }

      const requestResetPasswordOrError =
        await this.requestResetPasswordUseCase.execute(
          usuario.value.getValue(),
        );

      if (requestResetPasswordOrError.isLeft()) {
        return left(requestResetPasswordOrError.value);
      }

      const { link, usuarioId, resetPasswordToken } =
        requestResetPasswordOrError.value.getValue();

      const sendEmailOrError =
        await this.emailService.sendRequestResetPasswordEmail({
          email,
          link,
          usuario: usuario.value.getValue(),
        });

      if (sendEmailOrError.isLeft()) {
        return left(sendEmailOrError.value);
      }

      return right(
        Result.ok<{
          link: string;
          usuarioId: string;
          resetPasswordToken: string;
        }>({
          link,
          usuarioId,
          resetPasswordToken,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async resetPassword(
    usuarioId: string,
    resetPasswordToken: string,
    password: string,
  ): Promise<Response> {
    try {
      const usuario = await this.usuarioService.getById({ id: usuarioId });

      if (usuario.isLeft()) {
        return left(new LoginErrors.UserNotFound());
      }

      const resetOrError = await this.resetPasswordUseCase.execute({
        usuario: usuario.value.getValue(),
        resetPasswordToken,
        password,
      });

      if (resetOrError.isLeft()) {
        return left(resetOrError.value);
      }

      const resultOrError = await this.usuarioService.redefinirSenha({
        passwordHash: resetOrError.value.getValue(),
        email: usuario.value.getValue().email,
      });

      if (resultOrError.isLeft()) {
        return left(resultOrError.value);
      }

      const sendEmailOrError = await this.emailService.sendPasswordChangedEmail(
        {
          email: usuario.value.getValue().email,
          usuario: usuario.value.getValue(),
        },
      );

      if (sendEmailOrError.isLeft()) {
        return left(sendEmailOrError.value);
      }

      return right(Result.ok<string>(sendEmailOrError.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
