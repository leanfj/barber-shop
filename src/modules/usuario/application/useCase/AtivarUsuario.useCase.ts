import bcrypt from 'bcrypt';
import Usuario from '../../domain/entities/Usuario';
import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import type ITokenRepository from '../../../../modules/authentication/domain/repositories/ITokenRepository';
import { AtivarUsuarioErrors } from './AtivarUsuarioErrors';

export interface AtivarUsuarioInput {
  usuarioId: string;
  token: string;
}

export type AtivarUsuarioOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class AtivarUsuarioUseCase
  implements IUseCase<AtivarUsuarioInput, Promise<AtivarUsuarioOutput>>
{
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(input: AtivarUsuarioInput): Promise<AtivarUsuarioOutput> {
    try {
      const usuarioExists = await this.usuarioRepository.getById(
        input.usuarioId,
      );

      if (usuarioExists.isLeft()) {
        return left(new AtivarUsuarioErrors.UsuarioNotExists());
      }

      const tokenExits = await this.tokenRepository.findByUsuarioId(
        usuarioExists.value.getValue().id.toValue(),
      );

      if (tokenExits.isLeft()) {
        return left(new AtivarUsuarioErrors.TokenNotExists());
      }

      const chekPassword = await bcrypt.compare(
        input.token,
        tokenExits.value.getValue().token,
      );

      if (!chekPassword) {
        return left(new AtivarUsuarioErrors.TokenInvalid());
      }

      await this.tokenRepository.delete(tokenExits.value.getValue());

      const usuario = Usuario.create(
        {
          tenantId: usuarioExists.value.getValue().tenantId,
          nome: usuarioExists.value.getValue().nome,
          email: usuarioExists.value.getValue().email,
          password: usuarioExists.value.getValue().password,
          isActive: usuarioExists.value.getValue().isActive,
          dataCadastro: usuarioExists.value.getValue().dataCadastro,
          dataAtualizacao: usuarioExists.value.getValue().dataAtualizacao,
        },
        usuarioExists.value.getValue().id,
      );

      await this.usuarioRepository.ativar(usuario);

      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
