import { type Either, type Result } from '../../../../core/logic/Result';
import type IRepository from '../../../../core/domain/repositories/IRepository';
import { type AppError } from '../../../../core/application/AppError';
import type Tenant from '../entities/Tenant';

type Response = Either<AppError.UnexpectedError, Result<Tenant>>;

export default interface ITenantRepository
  extends IRepository<Tenant, Response> {
  getByNome: (nome: string) => Promise<Response>;
}
