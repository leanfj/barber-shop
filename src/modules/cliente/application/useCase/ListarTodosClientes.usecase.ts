import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Cliente from '../../domain/entities/Cliente';
import type IClienteRepository from '../../domain/repositories/IClienteRepository';
import { ListarTodosClientesErrors } from './ListarTodosClientesUseCase.errors';

export type ListarTodosClientesOutput = Either<
  AppError.UnexpectedError,
  Result<{
    total: number;
    data: Cliente[];
  }>
>;

export default class ListarTodosClientes
  implements
    IUseCase<
      {
        skip: string;
        take: string;
        cliente?: Cliente;
      },
      Promise<ListarTodosClientesOutput>
    >
{
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: {
    skip: string;
    take: string;
  }): Promise<ListarTodosClientesOutput> {
    try {
      const existingClientes = await this.clienteRepository.getAll(
        input.skip,
        input.take,
      );

      if (existingClientes.isLeft()) {
        return left(new ListarTodosClientesErrors.ClienteListEmpty());
      }

      return right(
        Result.ok<{
          total: number;
          data: Cliente[];
        }>(existingClientes.value.getValue()),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
