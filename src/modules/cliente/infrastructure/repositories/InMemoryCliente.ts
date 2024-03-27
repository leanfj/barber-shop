import { type AppError } from '../../../../core/application/AppError';
import {
  type Either,
  left,
  Result,
  right,
} from '../../../../core/logic/Result';
import type Cliente from '../../../../modules/cliente/domain/entities/Cliente';
import type IClienteRepository from '../../../../modules/cliente/domain/repositories/IClienteRepository';
import { ClienteRepositoryErrors } from './clienteRepositoryErrors';

type Response = Either<AppError.UnexpectedError, Result<Cliente>>;
export default class InMemoryClienteRepository implements IClienteRepository {
  private readonly clientes: Cliente[] = [];

  async findByNome(nome: string): Promise<Response> {
    const clienteData = this.clientes.find((cliente) => cliente.nome === nome);

    if (!clienteData) {
      return left(new ClienteRepositoryErrors.ClienteNotExists());
    }

    return right(Result.ok<Cliente>(clienteData));
  }

  async save(cliente: Cliente): Promise<any> {
    this.clientes.push(cliente);
  }

  async exists(t: Cliente): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(t: Cliente): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}
