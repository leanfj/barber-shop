import { type Either, type Result } from '../../../../core/logic/Result';
import type IRepository from '../../../../core/domain/repositories/IRepository';
import type Cliente from '../entities/Cliente';
import { type AppError } from '../../../../core/application/AppError';

type Response = Either<AppError.UnexpectedError, Result<Cliente>>;

export default interface IClienteRepository extends IRepository<Cliente> {
  findByNome: (input: string) => Promise<Response>;
}
