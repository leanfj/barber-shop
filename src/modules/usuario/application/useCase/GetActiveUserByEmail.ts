import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import { AppError } from '../../../../core/application/AppError';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Usuario from '../../domain/entities/Usuario';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import { GetActiveUserByEmailErrors } from './GetActiveUserByEmailErrors';
import Email from '../../../../core/domain/valueObjects/Email';
import { ZodError } from 'zod';

export interface GetactiveUserByEmailInput {
  email: string;
}

export type GetactiveUserByEmailOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class GetActiveUserByEmail
  implements
    IUseCase<GetactiveUserByEmailInput, Promise<GetactiveUserByEmailOutput>>
{
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(
    input: GetactiveUserByEmailInput,
  ): Promise<GetactiveUserByEmailOutput> {
    try {
      const email = Email.setValue(input.email).getValue();
      const usuario = await this.usuarioRepository.findActivedByEmail(email);

      if (usuario.isLeft()) {
        return left(new GetActiveUserByEmailErrors.UsuarioNotExist());
      }

      return right(Result.ok<Usuario>(usuario.value.getValue()));
    } catch (error) {
      if (error instanceof ZodError) {
        return left(new GetActiveUserByEmailErrors.InvalidData(error));
      }
      return left(new AppError.UnexpectedError(error));
    }
  }
}
