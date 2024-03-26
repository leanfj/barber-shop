// import { GetUsuarioByIdUseCase } from './useCase/GetUsuarioById.useCase';
// import { GetUsuarioByEmailUseCase } from './useCase/GetUsuarioByEmail.useCase';
import {
  type CadastraUsuarioInput,
  CadastraUsuario,
} from './useCase/CadastraUsuario';
// import { GetactivedUsuarioByEmailUseCase } from './useCase/GetActivedUsuarioByEmail.useCase';
import { left, Result, right, type Either } from '../../../core/logic/Result';
import { AppError } from '../../../core/application/AppError';
import type Usuario from '../domain/entities/Usuario';
import type IUsuarioRepository from '../domain/repositories/IUsuario.repository';

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;

export class UsuarioService {
  private readonly cadastraUsuario: CadastraUsuario;
  // private getUsuarioByEmailUseCase: GetUsuarioByEmailUseCase;
  // private getActivedUsuarioByEmailUseCase: GetactivedUsuarioByEmailUseCase;
  // private getUsuarioByIdUseCase: GetUsuarioByIdUseCase;

  constructor(readonly usuarioRepository: IUsuarioRepository) {
    this.cadastraUsuario = new CadastraUsuario(usuarioRepository);
    // this.getUsuarioByEmailUseCase = new GetUsuarioByEmailUseCase(
    //   usuarioRepository,
    // );
    // this.getActivedUsuarioByEmailUseCase = new GetactivedUsuarioByEmailUseCase(
    //   usuarioRepository,
    // );
    // this.getUsuarioByIdUseCase = new GetUsuarioByIdUseCase(usuarioRepository);
  }

  public async create(usuario: CadastraUsuarioInput): Promise<Response> {
    try {
      const result = await this.cadastraUsuario.execute(usuario);
      if (result.isLeft()) {
        return left(result.value);
      } else {
        return right(Result.ok<Usuario>(result.value.getValue()));
      }
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  // public async getByEmail(email: string): Promise<Response> {
  //   try {
  //     const result = await this.getUsuarioByEmailUseCase.execute(email);

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

  // public async getById(id: string): Promise<Response> {
  //   try {
  //     const result = await this.getUsuarioByIdUseCase.execute(id);

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
