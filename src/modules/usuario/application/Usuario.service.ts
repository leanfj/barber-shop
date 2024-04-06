import {
  type CadastraUsuarioInput,
  CadastraUsuario,
} from './useCase/CadastraUsuario';
import { type Either, left, Result, right } from '../../../core/logic/Result';
import { AppError } from '../../../core/application/AppError';
import type Usuario from '../domain/entities/Usuario';
import type IUsuarioRepository from '../domain/repositories/IUsuarioRepository';
import {
  GetUsuarioByEmail,
  type GetUsuarioByEmailInput,
} from './useCase/GetUsuarioByEmail';
import {
  GetUsuarioById,
  type GetUsuarioByIdInput,
} from './useCase/GetUsuarioById';
import {
  GetActiveUserByEmail,
  type GetactiveUserByEmailInput,
} from './useCase/GetActiveUserByEmail';
import { type TenantService } from '../../../modules/tenant/application/tenant.service';
import {
  RedefinirSenhaUsuarioUseCase,
  type RedefinirSenhaUsuarioInput,
} from './useCase/RedefinirSenhaUsuario.useCase';
import { SendEmailAtivarUsuarioUseCase } from './useCase/SendEmailAtivarUsuario.useCase';
import type ITokenRepository from '../../../modules/authentication/domain/repositories/ITokenRepository';
import { GetUsuarioByEmailErrors } from './useCase/GetUsuarioByEmailErrors';
import { type EmailService } from '../../../modules/email/application/Email.service';

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;

export class UsuarioService {
  private readonly cadastraUsuario: CadastraUsuario;
  private readonly getUsuarioByEmail: GetUsuarioByEmail;
  private readonly getActiveUserByEmail: GetActiveUserByEmail;
  private readonly getUsuarioById: GetUsuarioById;
  private readonly redefinirSenhaUsuarioUseCase: RedefinirSenhaUsuarioUseCase;
  private readonly sendEmailAtivarUsuarioUseCase: SendEmailAtivarUsuarioUseCase;

  private readonly tenantService: TenantService;
  private readonly emailService: EmailService;

  constructor(
    readonly usuarioRepository: IUsuarioRepository,
    readonly tokenRepository: ITokenRepository,

    tenantService: TenantService,
    emailService: EmailService,
  ) {
    this.tenantService = tenantService;
    this.emailService = emailService;
    this.cadastraUsuario = new CadastraUsuario(usuarioRepository);
    this.getUsuarioByEmail = new GetUsuarioByEmail(usuarioRepository);
    this.getActiveUserByEmail = new GetActiveUserByEmail(usuarioRepository);
    this.getUsuarioById = new GetUsuarioById(usuarioRepository);
    this.redefinirSenhaUsuarioUseCase = new RedefinirSenhaUsuarioUseCase(
      usuarioRepository,
    );
    this.sendEmailAtivarUsuarioUseCase = new SendEmailAtivarUsuarioUseCase(
      usuarioRepository,
      tokenRepository,
    );
  }

  public async create(input: CadastraUsuarioInput): Promise<Response> {
    try {
      const tenant = await this.tenantService.create({
        nome: input.nome,
        slug: input.nome,
        isAtivo: false,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      if (tenant.isLeft()) {
        return left(tenant.value);
      }

      const usuario = await this.cadastraUsuario.execute({
        email: input.email,
        isActive: false,
        nome: input.nome,
        password: input.password,
        tenantId: tenant.value.getValue().id.toString(),
      });

      if (usuario.isLeft()) {
        return left(usuario.value);
      }

      const sendEmailOrError = await this.sendEmailAtivarUsuario({
        email: input.email,
      });

      if (sendEmailOrError.isLeft()) {
        return left(sendEmailOrError.value);
      }

      return right(Result.ok<Usuario>(usuario.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async getByEmail(input: GetUsuarioByEmailInput): Promise<Response> {
    try {
      const result = await this.getUsuarioByEmail.execute(input);

      if (result.isLeft()) {
        return left(result.value);
      }

      const usuario = result.value.getValue();
      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async getActiveByEmail(
    input: GetactiveUserByEmailInput,
  ): Promise<Response> {
    try {
      const result = await this.getActiveUserByEmail.execute(input);

      if (result.isLeft()) {
        return left(result.value);
      }
      const usuario = result.value.getValue();
      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async getById(id: GetUsuarioByIdInput): Promise<Response> {
    try {
      const result = await this.getUsuarioById.execute(id);

      if (result.isLeft()) {
        return left(result.value);
      }
      const usuario = result.value.getValue();
      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async redefinirSenha(
    input: RedefinirSenhaUsuarioInput,
  ): Promise<Response> {
    try {
      const result = await this.redefinirSenhaUsuarioUseCase.execute(input);

      if (result.isLeft()) {
        return left(result.value);
      }
      const usuario = result.value.getValue();
      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async sendEmailAtivarUsuario(input: {
    email: string;
  }): Promise<Response> {
    try {
      const usuario = await this.getUsuarioByEmail.execute({
        email: input.email,
      });

      if (usuario.isLeft()) {
        return left(new GetUsuarioByEmailErrors.UsuarioNotExists());
      }

      const sendEmailAtivarUsuarioOrError =
        await this.sendEmailAtivarUsuarioUseCase.execute({
          email: usuario.value.getValue().email,
        });

      if (sendEmailAtivarUsuarioOrError.isLeft()) {
        return left(sendEmailAtivarUsuarioOrError.value);
      }

      const { link } = sendEmailAtivarUsuarioOrError.value.getValue();

      const sendEmailOrError = await this.emailService.sendActivationEmail({
        email: usuario.value.getValue().email,
        link,
        usuario: usuario.value.getValue(),
      });

      if (sendEmailOrError.isLeft()) {
        return left(sendEmailOrError.value);
      }

      return right(Result.ok<Usuario>(usuario.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
