import { type Either, type Result } from '../../../../core/logic/Result';
import type IRepository from '../../../../core/domain/repositories/IRepository';
import type Cliente from '../entities/Cliente';
import { type AppError } from '../../../../core/application/AppError';
import type ClienteToPersistenceDTO from '../../../../modules/cliente/application/dto/ClienteToPersistence.dto';
import type ClienteToResponseDTO from '../../../../modules/cliente/application/dto/ClienteToResponse.dto';

type Response = Either<AppError.UnexpectedError, Result<ClienteToResponseDTO>>;

export default interface IClienteRepository
  extends IRepository<ClienteToPersistenceDTO, Response> {
  findByNome: (nome: string) => Promise<Response>;
  getAll: (
    skip: string,
    take: string,
  ) => Promise<
    Either<
      AppError.UnexpectedError,
      Result<{
        total: number;
        data: Cliente[];
      }>
    >
  >;
}
