import type IClienteRepository from '../domain/repositories/IClienteRepository';
import CadastrarCliente, {
  type CadastrarClienteInput,
} from './useCase/CadastrarCliente';
import type Cliente from '../domain/entities/Cliente';
import { AppError } from '../../../core/application/AppError';
import { type Either, Result, left, right } from '../../../core/logic/Result';

type Response = Either<AppError.UnexpectedError, Result<Cliente[] | Cliente>>;

export class ClienteService {
  private readonly CadastratClienteUseCase: CadastrarCliente;

  constructor(readonly clienteRepository: IClienteRepository) {
    this.CadastratClienteUseCase = new CadastrarCliente(clienteRepository);
    // this.updateClienteUseCase = new UpdateClienteUseCase(clienteRepository);
    // this.getAllClienteUseCase = new GetAllClienteUseCase(clienteRepository);
    // this.deleteClienteUseCase = new DeleteClienteUseCase(clienteRepository);
  }

  public async create(cliente: CadastrarClienteInput): Promise<Response> {
    try {
      const result = await this.CadastratClienteUseCase.execute(cliente);

      if (result.isLeft()) {
        return left(result.value);
      }
      return right(Result.ok<Cliente>(result.value.getValue()));
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
  //     const validOrError = await validatorDTO(ClienteInputDTO, cliente, {skipMissingProperties: true});
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
