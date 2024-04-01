import { AppError } from '../../../../core/application/AppError';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import { Token } from '../../domain/entities/Token';
import { TokenRepositoryErrors } from './tokenRepositoryErrors';
import type ITokenRepository from '../../domain/repositories/ITokenRepository';

type Response = Either<AppError.UnexpectedError, Result<Token>>;

export class InMemorytokenRepository implements ITokenRepository {
  private readonly tokens: Token[] = [];

  async findByUsuarioId(id: string): Promise<Response> {
    try {
      const tokenData = this.tokens.find(
        (token) => token.usuarioId.toString() === id,
      );
      if (!tokenData) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }
      return right(Result.ok<Token>(tokenData));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async exists(input: Token): Promise<boolean> {
    const token = this.tokens.find(
      (token) => token.id.toString() === input.id.toValue(),
    );

    if (!token) {
      return false;
    }

    return true;
  }

  async save(token: Token): Promise<Response> {
    try {
      const newToken = Token.create(
        {
          token: token.token,
          usuarioId: token.usuarioId,
          tenantId: token.tenantId,
          dataCadastro: token.dataCadastro || new Date(),
          dataAtualizacao: token.dataAtualizacao || new Date(),
        },
        token.id,
      );

      this.tokens.push(newToken);
      return right(Result.ok<Token>(newToken));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async delete(input: Token): Promise<any> {
    try {
      const index = this.tokens.findIndex(
        (token) => token.id.toString() === input.id.toValue(),
      );
      if (index === -1) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }
      this.tokens.splice(index, 1);
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async getById(id: string): Promise<Response> {
    try {
      const token = this.tokens.find((token) => token.id.toValue() === id);
      if (!token) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }
      return right(Result.ok<Token>(token));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
