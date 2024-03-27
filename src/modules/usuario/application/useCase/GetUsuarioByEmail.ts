import {
  type Either,
  left,
  Result,
  right,
} from '../../../../core/logic/Result';
import { GetUsuarioByEmailErrors } from './GetUsuarioByEmailErrors';
import { AppError } from '../../../../core/application/AppError';
import type Usuario from '../../domain/entities/Usuario';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import Email from '../../../../core/domain/valueObjects/Email';
import { ZodError } from 'zod';

export interface GetUsuarioByEmailInput {
  email: string;
}

export type GetUsuarioByEmailOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class GetUsuarioByEmail
  implements IUseCase<GetUsuarioByEmailInput, Promise<GetUsuarioByEmailOutput>>
{
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(
    input: GetUsuarioByEmailInput,
  ): Promise<GetUsuarioByEmailOutput> {
    try {
      const email = Email.setValue(input.email).getValue();
      const usuario = await this.usuarioRepository.findByEmail(email);

      if (usuario.isLeft()) {
        return left(new GetUsuarioByEmailErrors.UsuarioNotExists());
      }

      return right(Result.ok<Usuario>(usuario.value.getValue()));
    } catch (error) {
      if (error instanceof ZodError) {
        return left(new GetUsuarioByEmailErrors.InvalidData(error));
      }
      return left(new AppError.UnexpectedError(error));
    }
  }
}
