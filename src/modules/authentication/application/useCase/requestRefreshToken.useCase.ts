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
import { getUnixTime, isAfter } from 'date-fns';
import { RequestRefreshTokenErrors } from './requestRefreshTokenErrors';
import TokenVO from '../../../../core/domain/valueObjects/TokenVO';
import type Usuario from 'modules/usuario/domain/entities/Usuario';

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
      const tokenData = await this.tokenRepository.findByToken(
        input.token,
        input.usuario.id.toValue(),
      );

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
        dataExpiracao: DataExpiracao.setValue(),
        usuarioId: input.usuario.id.toString(),
        tenantId: input.usuario.tenantId,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
        token: await TokenVO.setValue({
          id: input.usuario.id.toString(),
          nome: input.usuario.nome,
          email: input.usuario.email,
          tenantId: input.usuario.tenantId,
        }),
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
