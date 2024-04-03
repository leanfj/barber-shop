import bcrypt from 'bcrypt';
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
import TokenVO from '../../../../core/domain/valueObjects/Token';

export interface LoginInput {
  email: string;
  password: string;
}

type Response = Either<AppError.UnexpectedError, Result<{ token: Token }>>;

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

      const token = Token.create({
        dataExpiracao: DataExpiracao.setValue(),
        usuarioId: input.usuario.id.toString(),
        tenantId: input.usuario.tenantId,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
        token: await TokenVO.setValue({
          id: input.usuario.id.toString(),
          nome: input.usuario.nome,
          email: input.usuario.email,
          tenantId: input.usuario.tenantId,
        }),
      });

      const tokenExist = await this.tokenRepository.findByUsuarioId(
        input.usuario.id.toString(),
      );

      if (tokenExist.isRight()) {
        await this.tokenRepository.delete(tokenExist.value.getValue());
      }

      await this.tokenRepository.save(token);

      return right(
        Result.ok<{ token: Token }>({
          token,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
