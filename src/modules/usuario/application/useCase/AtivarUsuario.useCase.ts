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
import { AtivarUsuarioErrors } from './AtivarUsuarioErrors';

export interface AtivarUsuarioInput {
  ativarToken: string;
  usuarioId: string;
}

export type AtivarUsuarioOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class AtivarUsuario
  implements IUseCase<AtivarUsuarioInput, Promise<AtivarUsuarioOutput>>
{
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: AtivarUsuarioInput): Promise<AtivarUsuarioOutput> {
    try {
      const usuarioExists = await this.usuarioRepository.getById(
        input.usuarioId,
      );

      if (usuarioExists.isLeft()) {
        return left(new AtivarUsuarioErrors.UsuarioNotExists());
      }

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
