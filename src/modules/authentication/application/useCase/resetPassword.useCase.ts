import { AppError } from '../../../../core/application/AppError';
import { TokenErrors } from './resetTokenErrors';
import { compare, genSalt, hash } from 'bcrypt';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import type ITokenRepository from '../../../../modules/authentication/domain/repositories/ITokenRepository';
import type Usuario from '../../../../modules/usuario/domain/entities/Usuario';

type Response = Either<AppError.UnexpectedError, Result<string>>;

interface input {
  usuario: Usuario;
  resetPasswordToken: string;
  password: string;
}

export class ResetPasswordUseCase
  implements IUseCase<input, Promise<Response>>
{
  constructor(private readonly tokenRepository: ITokenRepository) {}

  async execute({
    usuario,
    resetPasswordToken,
    password,
  }: input): Promise<Response> {
    try {
      const tokenOrError = await this.tokenRepository.findByUsuarioId(
        usuario.id.toValue(),
      );

      if (tokenOrError.isLeft()) {
        return left(tokenOrError.value);
      }

      const tokenHash = tokenOrError.value.getValue().token;

      const isValid = await compare(resetPasswordToken, tokenHash);

      if (!isValid) {
        return left(new TokenErrors.TokenInvalid());
      }

      const salt = await genSalt(12);
      const passwordHash = await hash(password, salt);

      await this.tokenRepository.delete(tokenOrError.value.getValue());

      return right(Result.ok<string>(passwordHash));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
