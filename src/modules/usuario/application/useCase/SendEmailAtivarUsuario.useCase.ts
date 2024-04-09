import Usuario from '../../domain/entities/Usuario';
import bcrypt from 'bcrypt';

import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import { SendEmailAtivarUsuarioUseCaseErrors } from './SendEmailAtivarUsuarioErrors';
import { randomBytes } from 'crypto';
import { Token } from '../../../authentication/domain/entities/Token';
import DataExpiracao from '../../../../core/domain/valueObjects/DataExpiracao';
import type ITokenRepository from '../../../authentication/domain/repositories/ITokenRepository';

export interface AtivarUsuarioInput {
  email: string;
}

export type AtivarUsuarioOutput = Either<
  AppError.UnexpectedError,
  Result<{
    link: string;
    usuarioId: string;
  }>
>;

export class SendEmailAtivarUsuarioUseCase
  implements IUseCase<AtivarUsuarioInput, Promise<AtivarUsuarioOutput>>
{
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(input: AtivarUsuarioInput): Promise<AtivarUsuarioOutput> {
    try {
      const usuarioExists = await this.usuarioRepository.findByEmail(
        input.email,
      );

      if (!usuarioExists.isRight()) {
        return left(
          new SendEmailAtivarUsuarioUseCaseErrors.UsuarioNaoEncontrado(
            input.email,
          ),
        );
      }

      const usuario = Usuario.create(
        {
          tenantId: usuarioExists.value.getValue().tenantId,
          nome: usuarioExists.value.getValue().nome,
          email: usuarioExists.value.getValue().email,
          password: usuarioExists.value.getValue().password,
          isActive: usuarioExists.value.getValue().isActive,
          dataCadastro: usuarioExists.value.getValue().dataCadastro,
          dataAtualizacao: new Date(),
        },
        usuarioExists.value.getValue().id,
      );

      const salt = await bcrypt.genSalt(12);

      const activationToken = randomBytes(32).toString('hex');

      const activationTokenHash = await bcrypt.hash(activationToken, salt);

      const token = Token.create({
        token: activationTokenHash,
        usuarioId: usuario.id.toString(),
        tenantId: usuario.tenantId,
        dataExpiracao: DataExpiracao.setValue(),
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      await this.tokenRepository.save(token);

      const client = process.env.CLIENT_URL;

      const link = `${client}/#/activation?token=${activationToken}&usuarioId=${usuario.id.toString()}`;

      return right(
        Result.ok<{
          link: string;
          usuarioId: string;
        }>({
          link,
          usuarioId: usuario.id.toString(),
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
