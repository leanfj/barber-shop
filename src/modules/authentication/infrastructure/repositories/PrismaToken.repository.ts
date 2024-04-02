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
import prisma from '../../../../core/infrastructure/database/Prisma';
import DataExpiracao from '../../../../core/domain/valueObjects/DataExpiracao';
import UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

type Response = Either<AppError.UnexpectedError, Result<Token>>;

export class PrismaTokenRepository implements ITokenRepository {
  async findByUsuarioId(id: string): Promise<Response> {
    try {
      const tokenData = await prisma.token.findFirst({
        where: {
          usuarioId: id,
        },
      });

      if (!tokenData) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }

      const tokenToApplication = Token.create(
        {
          token: tokenData.token,
          tenantId: tokenData.tenantId,
          dataExpiracao: new DataExpiracao({ value: tokenData.dataExpiracao }),
          usuarioId: tokenData.usuarioId,
          dataAtualizacao: tokenData.dataAtualizacao,
          dataCadastro: tokenData.dataCadastro,
        },
        new UniqueEntityId(tokenData.id),
      );

      return right(Result.ok<Token>(tokenToApplication));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async exists(input: Token): Promise<boolean> {
    const token = await prisma.token.findFirst({
      where: {
        id: input.id.toValue(),
      },
    });

    if (!token) {
      return false;
    }

    return true;
  }

  async save(token: Token): Promise<Response> {
    try {
      const tokenData = await prisma.token.create({
        data: {
          id: token.id.toString(),
          token: token.token,
          tenantId: token.tenantId,
          dataExpiracao: token.dataExpiracao,
          usuarioId: token.usuarioId,
          dataAtualizacao: token.dataAtualizacao,
          dataCadastro: token.dataCadastro,
        },
      });

      const tokenToApplication = Token.create(
        {
          token: tokenData.token,
          tenantId: tokenData.tenantId,
          dataExpiracao: DataExpiracao.setValue(),
          usuarioId: tokenData.usuarioId,
          dataAtualizacao: tokenData.dataAtualizacao,
          dataCadastro: tokenData.dataCadastro,
        },
        new UniqueEntityId(tokenData.id),
      );

      return right(Result.ok<Token>(tokenToApplication));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async delete(input: Token): Promise<any> {
    try {
      const tokenData = await prisma.token.findFirst({
        where: {
          id: input.id.toValue(),
        },
      });

      if (!tokenData) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }

      await prisma.token.delete({
        where: {
          id: input.id.toValue(),
        },
      });
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async getById(id: string): Promise<Response> {
    try {
      const token = await prisma.token.findFirst({
        where: {
          id,
        },
      });

      if (!token) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }

      const tokenToApplication = Token.create(
        {
          token: token.token,
          tenantId: token.tenantId,
          dataExpiracao: new DataExpiracao({ value: token.dataExpiracao }),
          usuarioId: token.usuarioId,
          dataAtualizacao: token.dataAtualizacao,
          dataCadastro: token.dataCadastro,
        },
        new UniqueEntityId(token.id),
      );

      return right(Result.ok<Token>(tokenToApplication));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async findByToken(token: string): Promise<Response> {
    try {
      const tokenData = await prisma.token.findFirst({
        where: {
          token,
        },
      });

      if (!tokenData) {
        return left(new TokenRepositoryErrors.TokenNotExists());
      }

      const tokenToApplication = Token.create(
        {
          token: tokenData.token,
          tenantId: tokenData.tenantId,
          dataExpiracao: new DataExpiracao({ value: tokenData.dataExpiracao }),
          usuarioId: tokenData.usuarioId,
          dataAtualizacao: tokenData.dataAtualizacao,
          dataCadastro: tokenData.dataCadastro,
        },
        new UniqueEntityId(tokenData.id),
      );

      return right(Result.ok<Token>(tokenToApplication));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
