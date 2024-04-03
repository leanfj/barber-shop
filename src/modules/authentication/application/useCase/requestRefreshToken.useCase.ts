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
import { getUnixTime, isAfter } from 'date-fns';
import TokenVO from '../../../../core/domain/valueObjects/Token';

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
      const tokenDataExpired = isAfter(
        new Date(),
        getUnixTime(parseInt(tokenData.value.getValue().dataExpiracao)),
      );

      if (tokenDataExpired) {
        await this.tokenRepository.delete(tokenData.value.getValue());
      }

      const token = Token.create({
        token: await TokenVO.setValue({
          id: tokenData.value.getValue().id.toString(),
          nome: input.usuario.nome,
          email: input.usuario.email,
          tenantId: input.usuario.tenantId,
        }),
        usuarioId: input.usuario.id.toString(),
        tenantId: input.usuario.tenantId,
        dataExpiracao: DataExpiracao.setValue(),
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      await this.tokenRepository.save(token);

      return right(
        Result.ok<{
          token: string;
        }>({
          token: token.token,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
