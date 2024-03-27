import { CadastraUsuarioErrors } from './CadastraUsuarioErrors';
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

export interface CadastraUsuarioInput {
  tenantId: string;
  nome: string;
  email: string;
  password: string;
  isActive: boolean;
}

export type CadastrarUsuarioOutput = Either<
  AppError.UnexpectedError,
  Result<Usuario>
>;

export class CadastraUsuario
  implements IUseCase<CadastraUsuarioInput, Promise<CadastrarUsuarioOutput>>
{
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: CadastraUsuarioInput): Promise<CadastrarUsuarioOutput> {
    try {
      const usuarioExists = await this.usuarioRepository.findByEmail(
        input.email,
      );

      if (!usuarioExists.isLeft()) {
        return left(
          new CadastraUsuarioErrors.UsuarioAlreadyExists(input.email),
        );
      }

      const salt = await bcrypt.genSalt(12);

      const passwordHash = await bcrypt.hash(input.password, salt);

      const usuario = Usuario.create({
        tenantId: input.tenantId,
        nome: input.nome,
        email: input.email,
        password: passwordHash,
        isActive: input.isActive,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      await this.usuarioRepository.save(usuario);

      return right(Result.ok<Usuario>(usuario));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
