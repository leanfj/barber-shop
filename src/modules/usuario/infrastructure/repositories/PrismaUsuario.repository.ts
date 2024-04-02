import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import Usuario from '../../domain/entities/Usuario';
import type IUsuarioRepository from '../../domain/repositories/IUsuarioRepository';
import { type AppError } from '../../../../core/application/AppError';
import { UsuarioRepositoryErrors } from './usuarioRepositoryErrors';
import UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';
import prisma from '../../../../core/infrastructure/database/Prisma';

type Response = Either<AppError.UnexpectedError, Result<Usuario>>;
export default class PrismaUsuarioRepository implements IUsuarioRepository {
  async findByEmail(email: string): Promise<Response> {
    const usuarioData = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    const usuarioApplication = Usuario.create(
      {
        nome: usuarioData.nome,
        tenantId: usuarioData.tenantId,
        email: usuarioData.email,
        password: usuarioData.password,
        isActive: usuarioData.isActive,
        dataAtualizacao: usuarioData.dataAtualizacao,
        dataCadastro: usuarioData.dataCadastro,
      },
      new UniqueEntityId(usuarioData.id),
    );

    return right(Result.ok<Usuario>(usuarioApplication));
  }

  async save(usuario: Usuario): Promise<Usuario> {
    await prisma.user.create({
      data: {
        id: usuario.id.toString(),
        tenantId: usuario.tenantId,
        nome: usuario.nome,
        email: usuario.email,
        password: usuario.password,
        isActive: usuario.isActive,
        dataAtualizacao: usuario.dataAtualizacao,
        dataCadastro: usuario.dataCadastro,
      },
    });

    return usuario;
  }

  async exists(t: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(usuario: Usuario): Promise<any> {
    await prisma.user.delete({
      where: {
        id: usuario.id.toString(),
      },
    });
  }

  async getById(id: string): Promise<Response> {
    const usuarioData = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    const usuarioapplication = Usuario.create(
      {
        nome: usuarioData.nome,
        tenantId: usuarioData.tenantId,
        email: usuarioData.email,
        password: usuarioData.password,
        isActive: usuarioData.isActive,
        dataAtualizacao: usuarioData.dataAtualizacao,
        dataCadastro: usuarioData.dataCadastro,
      },
      new UniqueEntityId(usuarioData.id),
    );

    return right(Result.ok<Usuario>(usuarioapplication));
  }

  async findActivedByEmail(email: string): Promise<Response> {
    const usuarioData = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    const usuarioToApplication = Usuario.create(
      {
        nome: usuarioData.nome,
        tenantId: usuarioData.tenantId,
        email: usuarioData.email,
        password: usuarioData.password,
        isActive: usuarioData.isActive,
        dataAtualizacao: usuarioData.dataAtualizacao,
        dataCadastro: usuarioData.dataCadastro,
      },
      new UniqueEntityId(usuarioData.id),
    );

    return right(Result.ok<Usuario>(usuarioToApplication));
  }

  async RedefinirSenha(usuario: Usuario): Promise<any> {
    const usuarioData = await prisma.user.findFirst({
      where: {
        email: usuario.email,
      },
    });

    if (!usuarioData) {
      return left(new UsuarioRepositoryErrors.UsuarioNotExists());
    }

    usuario.redefinirSenha(usuario.password);

    const usuarioUpdate = await prisma.user.update({
      where: {
        id: usuario.id.toString(),
      },
      data: {
        password: usuario.password,
      },
    });

    const usuarioToApplication = Usuario.create(
      {
        nome: usuarioUpdate.nome,
        tenantId: usuarioUpdate.tenantId,
        email: usuarioUpdate.email,
        password: usuarioUpdate.password,
        isActive: usuarioUpdate.isActive,
        dataAtualizacao: usuarioUpdate.dataAtualizacao,
        dataCadastro: usuarioUpdate.dataCadastro,
      },
      new UniqueEntityId(usuarioUpdate.id),
    );

    return right(Result.ok<Usuario>(usuarioToApplication));
  }
}
