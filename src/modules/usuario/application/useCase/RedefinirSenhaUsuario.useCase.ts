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
import { RedefinirSenhaUsuarioUseCaseErrors } from './RedefinirSenhaUsuarioErrors';

export interface RedefinirSenhaUsuarioInput {
  passwordHash: string;
  email: string;
}

export type RedefinirSenhaUsuarioOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class RedefinirSenhaUsuarioUseCase
  implements
    IUseCase<RedefinirSenhaUsuarioInput, Promise<RedefinirSenhaUsuarioOutput>>
{
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(
    input: RedefinirSenhaUsuarioInput,
  ): Promise<RedefinirSenhaUsuarioOutput> {
    try {
      const usuarioExists = await this.usuarioRepository.findByEmail(
        input.email,
      );

      if (!usuarioExists.isRight()) {
        return left(
          new RedefinirSenhaUsuarioUseCaseErrors.UsuarioNaoEncontrado(
            input.email,
          ),
        );
      }

      const usuario = Usuario.create(
        {
          tenantId: usuarioExists.value.getValue().tenantId,
          nome: usuarioExists.value.getValue().nome,
          email: usuarioExists.value.getValue().email,
          password: input.passwordHash,
          isActive: usuarioExists.value.getValue().isActive,
          dataCadastro: usuarioExists.value.getValue().dataCadastro,
          dataAtualizacao: new Date(),
        },
        usuarioExists.value.getValue().id,
      );

      await this.usuarioRepository.RedefinirSenha(usuario);

      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
