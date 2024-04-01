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

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;

export class UsuarioService {
  private readonly cadastraUsuario: CadastraUsuario;
  private readonly getUsuarioByEmail: GetUsuarioByEmail;
  private readonly getActiveUserByEmail: GetActiveUserByEmail;
  private readonly getUsuarioById: GetUsuarioById;
  private readonly redefinirSenhaUsuarioUseCase: RedefinirSenhaUsuarioUseCase;

  private readonly tenantService: TenantService;

  constructor(
    readonly usuarioRepository: IUsuarioRepository,
    tenantService: TenantService,
  ) {
    this.tenantService = tenantService;
    this.cadastraUsuario = new CadastraUsuario(usuarioRepository);
    this.getUsuarioByEmail = new GetUsuarioByEmail(usuarioRepository);
    this.getActiveUserByEmail = new GetActiveUserByEmail(usuarioRepository);
    this.getUsuarioById = new GetUsuarioById(usuarioRepository);
    this.redefinirSenhaUsuarioUseCase = new RedefinirSenhaUsuarioUseCase(
      usuarioRepository,
    );
  }

  public async create(input: CadastraUsuarioInput): Promise<Response> {
    try {
      const tenant = await this.tenantService.create({
        nome: input.nome,
        slug: input.nome,
        isAtivo: true,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      if (tenant.isLeft()) {
        return left(tenant.value);
      }

      const usuario = await this.cadastraUsuario.execute({
        ...input,
        tenantId: tenant.value.getValue().id.toString(),
      });

      if (usuario.isLeft()) {
        return left(usuario.value);
      } else {
        return right(Result.ok<Usuario>(usuario.value.getValue()));
      }
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async getByEmail(input: GetUsuarioByEmailInput): Promise<Response> {
    try {
      const result = await this.getUsuarioByEmail.execute(input);

      if (result.isLeft()) {
        return left(result.value);
      } else {
        const usuario = result.value.getValue();
        return right(Result.ok<Usuario>(usuario));
      }
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
      } else {
        const usuario = result.value.getValue();
        return right(Result.ok<Usuario>(usuario));
      }
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async getById(id: GetUsuarioByIdInput): Promise<Response> {
    try {
      const result = await this.getUsuarioById.execute(id);

      if (result.isLeft()) {
        return left(result.value);
      } else {
        const usuario = result.value.getValue();
        return right(Result.ok<Usuario>(usuario));
      }
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
      } else {
        const usuario = result.value.getValue();
        return right(Result.ok<Usuario>(usuario));
      }
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
