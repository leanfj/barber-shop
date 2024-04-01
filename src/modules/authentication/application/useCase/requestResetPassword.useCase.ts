import bcrypt from 'bcrypt';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import {
  type Either,
  left,
  Result,
  right,
} from '../../../../core/logic/Result';
import { randomBytes } from 'crypto';
import { type Token } from '../../domain/entities/Token';
import type ITokenRepository from '../../domain/repositories/ITokenRepository';
import type Usuario from '../../../../modules/usuario/domain/entities/Usuario';

type Response = Either<
  AppError.UnexpectedError,
  Result<{
    link: string;
    resetPasswordToken: string;
    usuarioId: string;
  }>
>;

export class RequestResetPasswordUseCase
  implements IUseCase<Usuario, Promise<Response>>
{
  constructor(private readonly tokenRepository: ITokenRepository) {}

  async execute(usuario: Usuario): Promise<Response> {
    try {
      const tokenData = await this.tokenRepository.findByUsuarioId(
        usuario.id.toString(),
      );

      if (tokenData.isRight()) {
        await this.tokenRepository.delete(tokenData.value.getValue());
      }

      const salt = await bcrypt.genSalt(12);

      const resetPasswordToken = randomBytes(32).toString('hex');

      const tokenHash = await bcrypt.hash(resetPasswordToken, salt);

      const token = {
        token: tokenHash,
        usuarioId: usuario.id.toString(),
        tenantId: usuario.tenantId,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      };

      await this.tokenRepository.save(token as Token);

      const { CLIENT_URL } = process.env;

      const link = `${CLIENT_URL}/change-password?token=${resetPasswordToken}&usuarioId=${usuario.id.toString()}`;

      return right(
        Result.ok<{
          link: string;
          resetPasswordToken: string;
          usuarioId: string;
        }>({
          link,
          resetPasswordToken,
          usuarioId: usuario.id.toString(),
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
