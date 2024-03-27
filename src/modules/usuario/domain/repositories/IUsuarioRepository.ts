import { type Either, type Result } from '../../../../core/logic/Result';
import type IRepository from '../../../../core/domain/repositories/IRepository';
import type Usuario from '../entities/Usuario';
import { type AppError } from '../../../../core/application/AppError';

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;

export default interface IUsuarioRepository
  extends IRepository<Usuario, Response> {
  findByEmail: (input: string) => Promise<Response>;
  findActivedByEmail: (input: string) => Promise<Response>;
}
