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
}
