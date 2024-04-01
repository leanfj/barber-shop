import bcrypt from 'bcrypt';
import { sign, type Secret } from 'jsonwebtoken';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import DataExpiracao from '../../../../core/domain/valueObjects/DataExpiracao';
import {
  type Either,
  left,
  Result,
  right,
} from '../../../../core/logic/Result';
import { Token } from '../../domain/entities/Token';
import type ITokenRepository from '../../domain/repositories/ITokenRepository';
import type Usuario from '../../../usuario/domain/entities/Usuario';
import { RequestRefreshTokenErrors } from './requestRefreshTokenErrors';

type Response = Either<
  AppError.UnexpectedError,
  Result<{
    token: string;
  }>
>;

export class RequestRefreshTokenUseCase
  implements
    IUseCase<
      {
        token: string;
        usuario: Usuario;
      },
      Promise<Response>
    >
{
  constructor(private readonly tokenRepository: ITokenRepository) {}

  async execute(input: { token: string; usuario: Usuario }): Promise<Response> {
    try {
      const tokenData = await this.tokenRepository.findByToken(input.token);

      if (tokenData.isLeft()) {
        return left(new RequestRefreshTokenErrors.TokenInvalid());
      }

      const { JWT_SECRET } = process.env;

      const tokenJWT = sign(
        {
          id: tokenData.value.getValue().id.toString(),
          nome: input.usuario.nome,
          email: input.usuario.email,
          tenantId: tokenData.value.getValue().tenantId,
        },
        JWT_SECRET as Secret,
        {
          subject: tokenData.value.getValue().id.toString(),
          expiresIn: '1d',
        },
      );

      const salt = await bcrypt.genSalt(12);

      const tokenHash = await bcrypt.hash(tokenJWT, salt);

      const token = Token.create({
        token: tokenHash,
        usuarioId: input.usuario.id.toString(),
        tenantId: input.usuario.tenantId,
        dataExpiracao: DataExpiracao.setValue(),
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      await this.tokenRepository.save(token);
      await this.tokenRepository.delete(tokenData.value.getValue());

      return right(
        Result.ok<{
          token: string;
        }>({
          token: tokenJWT,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
