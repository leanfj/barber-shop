import { AppError } from '../../../../core/application/AppError';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Usuario from '../../domain/entities/Usuario';
import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import { GetUsuarioByIdErrors } from './GetUsuarioByIdErrors';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';

export interface GetUsuarioByIdInput {
  id: string;
}

export type GetUsuarioByIdOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class GetUsuarioById
  implements IUseCase<GetUsuarioByIdInput, Promise<GetUsuarioByIdOutput>>
{
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: GetUsuarioByIdInput): Promise<GetUsuarioByIdOutput> {
    try {
      const usuario = await this.usuarioRepository.getById(input.id);

      if (usuario.isLeft()) {
        return left(new GetUsuarioByIdErrors.UsuarioNotExists());
      }

      return right(Result.ok<Usuario>(usuario.value.getValue()));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
