import bcrypt from 'bcrypt';
import { type Secret, sign } from 'jsonwebtoken';
import { LoginErrors } from './loginErrors';
import { AppError } from '../../../../core/application/AppError';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type Usuario from '../../../../modules/usuario/domain/entities/Usuario';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import type ITokenRepository from '../../../../modules/authentication/domain/repositories/ITokenRepository';
import { Token } from '../../domain/entities/Token';
import DataExpiracao from '../../../../core/domain/valueObjects/DataExpiracao';

export interface LoginInput {
  email: string;
  password: string;
}

type Response = Either<
  AppError.UnexpectedError,
  Result<{ token: string; refreshToken: Token }>
>;

export class LoginUseCase
  implements
    IUseCase<{ login: LoginInput; usuario: Usuario }, Promise<Response>>
{
  constructor(private readonly tokenRepository: ITokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  async execute(input: {
    login: LoginInput;
    usuario: Usuario;
  }): Promise<Response> {
    try {
      const chekPassword = await bcrypt.compare(
        input.login.password,
        input.usuario.password,
      );

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (!chekPassword) {
        return left(new LoginErrors.PasswordOrEmailIncorrect());
      }

      const { JWT_SECRET } = process.env;

      const tokenJWT = sign(
        {
          id: input.usuario.id.toString(),
          nome: input.usuario.nome,
          email: input.usuario.email,
          tenantId: input.usuario.tenantId,
        },
        JWT_SECRET as Secret,
        {
          subject: input.usuario.id.toString(),
          expiresIn: '1d',
        },
      );

      const salt = await bcrypt.genSalt(12);

      const tokenHash = await bcrypt.hash(tokenJWT, salt);

      const refreshToken = Token.create({
        token: tokenHash,
        dataExpiracao: DataExpiracao.setValue(),
        usuarioId: input.usuario.id.toString(),
        tenantId: input.usuario.tenantId,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      await this.tokenRepository.save(refreshToken);

      return right(
        Result.ok<{ token: string; refreshToken: Token }>({
          token: tokenJWT,
          refreshToken,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
