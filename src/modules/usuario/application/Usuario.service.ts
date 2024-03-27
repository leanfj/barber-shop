// import { GetUsuarioByIdUseCase } from './useCase/GetUsuarioById.useCase';
// import { GetUsuarioByEmailUseCase } from './useCase/GetUsuarioByEmail.useCase';
import {
  type CadastraUsuarioInput,
  CadastraUsuario,
} from './useCase/CadastraUsuario';
// import { GetactivedUsuarioByEmailUseCase } from './useCase/GetActivedUsuarioByEmail.useCase';
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

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;

export class UsuarioService {
  private readonly cadastraUsuario: CadastraUsuario;
  private readonly getUsuarioByEmail: GetUsuarioByEmail;
  private readonly getActiveUserByEmail: GetActiveUserByEmail;
  private readonly getUsuarioById: GetUsuarioById;

  constructor(readonly usuarioRepository: IUsuarioRepository) {
    this.cadastraUsuario = new CadastraUsuario(usuarioRepository);
    this.getUsuarioByEmail = new GetUsuarioByEmail(usuarioRepository);
    this.getActiveUserByEmail = new GetActiveUserByEmail(usuarioRepository);
    this.getUsuarioById = new GetUsuarioById(usuarioRepository);
  }

  public async create(input: CadastraUsuarioInput): Promise<Response> {
    try {
      const result = await this.cadastraUsuario.execute(input);
      if (result.isLeft()) {
        return left(result.value);
      } else {
        return right(Result.ok<Usuario>(result.value.getValue()));
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

  // public async getActivedByEmail(email: string): Promise<Response> {
  //   try {
  //     const result = await this.getActivedUsuarioByEmailUseCase.execute(email);

  //     if (result.isLeft()) {
  //       return left(result.value);
  //     } else {
  //       const usuario = result.value.getValue();
  //       return right(Result.ok<Usuario>(usuario));
  //     }
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }

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

  // public async getAll(): Promise<Response> {
  //   try {
  //     const result = await this.getAllClienteUseCase.execute();

  //     if (result.isLeft()) {
  //       return left(result.value);
  //     } else {
  //       const clienteList = result.value.getValue();
  //       return right(Result.ok<Cliente[] | Cliente>(clienteList));
  //     }
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }

  // public async update(
  //   cliente: ClienteInputDTO,
  //   id: UniqueEntityID
  // ): Promise<Response> {
  //   try {
  //     const validOrError = await validatorDto(ClienteInputDTO, cliente, {skipMissingProperties: true});
  //     if (validOrError.isLeft()) {
  //       return left(validOrError.value);
  //     }
  //     const result = await this.updateClienteUseCase.execute({
  //       ...cliente,
  //       id: id.toString(),
  //     });
  //     if (result.isLeft()) {
  //       return left(result.value);
  //     } else {
  //       return right(Result.ok<Cliente>(result.value.getValue()));
  //     }
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }

  // public async delete(id: UniqueEntityID): Promise<Response> {
  //   try {
  //     const result = await this.deleteClienteUseCase.execute(id);
  //     if (result.isLeft()) {
  //       return left(result.value);
  //     } else {
  //       return right(Result.ok<Cliente>(result.value.getValue()));
  //     }
  //   } catch (error) {
  //     return left(new AppError.UnexpectedError(error));
  //   }
  // }
}
