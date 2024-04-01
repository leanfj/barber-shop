import { type Either, type Result } from '../../../../core/logic/Result';
import type IRepository from '../../../../core/domain/repositories/IRepository';
import { type AppError } from '../../../../core/application/AppError';
import { type Token } from '../entities/Token';

type Response = Either<AppError.UnexpectedError, Result<Token>>;

export default interface ITokenRepository extends IRepository<Token, Response> {
  findByUsuarioId: (id: string) => Promise<Response>;
}
