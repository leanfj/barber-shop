import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import type Usuario from '../../domain/entities/Usuario';
import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import { type AppError } from '../../../../core/application/AppError';
import { UsuarioRepositoryErrors } from './usuarioRepositoryErrors';
import UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;
export default class InMemoryUsuario implements IUsuarioRepository {
  private readonly usuarios: Usuario[] = [];

  async findByEmail(email: string): Promise<Response> {
    const usuarioData = this.usuarios.find(
      (usuario) => usuario.email === email,
    );

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    return right(Result.ok<Usuario>(usuarioData));
  }

  async save(usuario: Usuario): Promise<any> {
    this.usuarios.push(usuario);
  }

  async exists(t: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(t: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Response> {
    const usuarioData = this.usuarios.find((usuario) =>
      usuario.id.equals(new UniqueEntityId(id)),
    );

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    return right(Result.ok<Usuario>(usuarioData));
  }

  async findActivedByEmail(email: string): Promise<Response> {
    const usuarioData = this.usuarios.find(
      (usuario) => usuario.email === email && usuario.isActive,
    );

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    return right(Result.ok<Usuario>(usuarioData));
  }
}
