import { AppError } from '../../../../core/application/AppError';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Usuario from '../../../usuario/domain/entities/Usuario';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import type ITokenRepository from '../../domain/repositories/ITokenRepository';
import { LogoutErrors } from './logoutErrors';

type Response = Either<AppError.UnexpectedError, Result<string>>;

export class LogoutUseCase
  implements IUseCase<{ usuario: Usuario }, Promise<Response>>
{
  constructor(private readonly tokenRepository: ITokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  async execute(input: { usuario: Usuario }): Promise<Response> {
    try {
      const tokenExist = await this.tokenRepository.findByUsuarioId(
        input.usuario.id.toString(),
      );

      if (tokenExist.isLeft()) {
        return left(new LogoutErrors.TokenNotExists());
      }

      if (tokenExist.isRight()) {
        await this.tokenRepository.delete(tokenExist.value.getValue());
      }

      return right(Result.ok<string>('Usuário deslogado com sucesso'));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
